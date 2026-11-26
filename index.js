require('dotenv').config();
const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const mongoose = require('mongoose');
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.get('/', (req, res) => res.send('Bot is Online! 🚀'));
app.listen(process.env.PORT || 3000);

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages]
});

client.commands = new Collection();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Conectado!'))
    .catch(err => console.error('❌ Erro MongoDB:', err));

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
const commandsJSON = [];

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
    commandsJSON.push(command.data.toJSON());
}

client.once('ready', async () => {
    console.log(`🚀 Bot Online como ${client.user.tag}`);
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
    try {
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commandsJSON });
        console.log('✅ Comandos registrados!');
    } catch (error) {
        console.error(error);
    }
});

client.on('interactionCreate', async interaction => {
    if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;
        try {
            await command.execute(interaction, client);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Erro interno!', ephemeral: true });
        }
    } else {
        const eventHandler = require('./events/interactionCreate');
        await eventHandler.execute(interaction, client);
    }
});

client.login(process.env.TOKEN);
