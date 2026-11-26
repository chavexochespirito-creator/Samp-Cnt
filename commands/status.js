const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { SAMPQuery } = require('../utils/sampQuery');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Mostra o status do servidor'),
    async execute(interaction) {
        await interaction.deferReply();
        const serverConfig = { ip: '151.242.227.85', port: 7777, name: 'BRASIL PLAY STARS' };
        const query = new SAMPQuery();
        const info = await query.getServerInfo(serverConfig);

        if (!info) return interaction.editReply('❌ Servidor Offline.');

        const embed = new EmbedBuilder()
            .setColor(0x2ecc71)
            .setTitle(serverConfig.name)
            .setDescription('Conecte-se à cidade e comece a construir sua história.')
            .setThumbnail('LINK_DA_SUA_LOGO') 
            .setImage('LINK_DO_SEU_BANNER') 
            .addFields(
                { name: '👤 Jogadores', value: `\`${info.players}\``, inline: false },
                { name: 'Status', value: `🟢 Online`, inline: false },
                { name: '🔗 Conecte-se com o IP', value: `\`${serverConfig.ip}:${serverConfig.port}\``, inline: false }
            )
            .setFooter({ text: `Atualiza a cada 30s | Hoje às ${new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}` })
            .setTimestamp();

        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setLabel('BAIXAR MOBILE').setURL('https://seulink.com/mobile').setStyle(ButtonStyle.Link),
            new ButtonBuilder().setLabel('BAIXAR PC').setURL('https://seulink.com/pc').setStyle(ButtonStyle.Link)
        );

        await interaction.editReply({ embeds: [embed], components: [buttons] });
    }
};
