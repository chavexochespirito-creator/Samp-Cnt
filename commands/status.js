const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { SAMPQuery } = require('../utils/sampQuery');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Mostra o status do servidor'),
    async execute(interaction) {
        await interaction.deferReply();
        
        const serverConfig = { 
            ip: '51.38.205.167',
            port: 15272,
            name: 'BRASIL AETHER RPG'
        };

        const query = new SAMPQuery();
        const info = await query.getServerInfo(serverConfig);

        if (!info) return interaction.editReply('❌ O servidor está offline.');

        const embed = new EmbedBuilder()
            .setColor(0x2ecc71)
            .setTitle(serverConfig.name)
            .setDescription('Conecte-se à cidade e comece a construir sua história.')
            .setThumbnail('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBwfz12NrXBb2G6ZXnN6ORk98hgvkQsLsStRCk_L5Tcw&s=10')
            .setImage('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFTxDjRHRRnXdjj0K3nuFcex8ogJDLhydsx4HBdtSJ-w&s=10')
            .addFields(
                { name: '👤 Jogadores', value: `\`${info.players}\``, inline: false },
                { name: 'Status', value: `🟢 Online`, inline: false },
                { name: '🔗 Conecte-se com o IP', value: `\`${serverConfig.ip}:${serverConfig.port}\``, inline: false }
            )
            .setFooter({ text: `Atualiza a cada 30s | Hoje às ${new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}` })
            .setTimestamp();

        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setLabel('BAIXAR MOBILE').setURL('https://LINK_MOBILE').setStyle(ButtonStyle.Link),
            new ButtonBuilder().setLabel('BAIXAR PC').setURL('https://LINK_PC').setStyle(ButtonStyle.Link)
        );

        await interaction.editReply({ embeds: [embed], components: [buttons] });
    }
};
