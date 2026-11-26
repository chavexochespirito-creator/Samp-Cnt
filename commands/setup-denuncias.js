const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-denuncias')
        .setDescription('Cria a mensagem de abertura de denúncias')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor(0xed4245)
            .setTitle('🛡️ CENTRAL DE DENÚNCIAS')
            .setDescription('Clique no botão abaixo para abrir uma denúncia.\n\n📌 **Como funciona:**\n• Clique em 📝 **Fazer Denúncia**.\n• Leia e aceite as regras.\n• Preencha o formulário.\n• Envie as provas no tópico criado.')
            .setFooter({ text: 'Stars Games' });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('btn_fazer_denuncia').setLabel('Fazer Denúncia').setEmoji('📝').setStyle(ButtonStyle.Danger)
        );

        await interaction.reply({ embeds: [embed], components: [row] });
    }
};
