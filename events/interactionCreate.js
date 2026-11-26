const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Report = require('../models/Report');

module.exports = {
    async execute(interaction, client) {
        if (interaction.customId === 'btn_fazer_denuncia') {
            const embed = new EmbedBuilder()
                .setColor(0xed4245)
                .setTitle('📖 LEIA AS REGRAS')
                .setDescription('Você precisa ler as regras de denúncia.\n\n➡️ **Regras:** [LINK_AQUI]\n\nAo concordar, você declara que leu as regras.')
                .setFooter({ text: 'Stars Games' });

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('btn_concordo_regras').setLabel('Li e concordo').setEmoji('✅').setStyle(ButtonStyle.Success)
            );
            return interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
        }

        if (interaction.customId === 'btn_concordo_regras') {
            const modal = new ModalBuilder().setCustomId('modal_denuncia').setTitle('Formulário de Denúncia');
            const fields = [
                { id: 'nome', label: 'Seu Nome', style: TextInputStyle.Short },
                { id: 'acusado', label: 'Nome do Acusado', style: TextInputStyle.Short },
                { id: 'org_acusado', label: 'Org do Acusado', style: TextInputStyle.Short },
                { id: 'org_denunciante', label: 'Sua Organização', style: TextInputStyle.Short },
                { id: 'motivo', label: 'Motivo', style: TextInputStyle.Paragraph },
            ];
            fields.forEach(f => modal.addComponents(new ActionRowBuilder().addComponents(
                new TextInputBuilder().setCustomId(f.id).setLabel(f.label).setStyle(f.style).setRequired(true)
            )));
            return interaction.showModal(modal);
        }

        if (interaction.isModalSubmit() && interaction.customId === 'modal_denuncia') {
            const nome = interaction.fields.getTextInputValue('nome');
            const acusado = interaction.fields.getTextInputValue('acusado');
            const orgAcusado = interaction.fields.getTextInputValue('org_acusado');
            const orgDenunciante = interaction.fields.getTextInputValue('org_denunciante');
            const motivo = interaction.fields.getTextInputValue('motivo');

            const channel = interaction.guild.channels.cache.get('1575560313573609522'); 
            const thread = await channel.threads.create({ name: `Denúncia - ${nome}`, autoArchiveDuration: 60, type: 11 });
            await thread.members.add(interaction.user.id);

            const report = await Report.create({ guildId: interaction.guild.id, threadId: thread.id, reporterId: interaction.user.id, accused, reason: motivo });

            const embed = new EmbedBuilder()
                .setColor(0x3498db)
                .setTitle('⚖️ INSTRUÇÕES DA DENÚNCIA')
                .setDescription(`Olá ${interaction.user}! Envie as provas abaixo.`)
                .addFields(
                    { name: '👤 Denunciante', value: `\`${nome}\``, inline: true },
                    { name: '🚫 Acusado', value: `\`${acusado}\``, inline: true },
                    { name: '🏢 Org Acusado', value: `\`${orgAcusado}\``, inline: true },
                    { name: '🛡️ Sua Org', value: `\`${orgDenunciante}\``, inline: true },
                    { name: '📝 Motivo', value: `\`${motivo}\`` }
                );

            const staffRow = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId(`status_analise_${report._id}`).setLabel('Em Análise').setEmoji('🔍').setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId(`status_aceita_${report._id}`).setLabel('Aceita').setEmoji('✅').setStyle(ButtonStyle.Success),
                new ButtonBuilder().setCustomId(`status_negada_${report._id}`).setLabel('Negada').setEmoji('❌').setStyle(ButtonStyle.Danger),
                new ButtonBuilder().setCustomId(`status_padrao_${report._id}`).setLabel('Fora do Padrão').setEmoji('🚫').setStyle(ButtonStyle.Secondary),
            );

            await thread.send({ content: `<@&1575562723067175042>`, embeds: [embed], components: [staffRow] });
            return interaction.reply({ content: `Aberta! Acesse: ${thread}`, ephemeral: true });
        }

        if (interaction.isButton() && interaction.customId.startsWith('status_')) {
            const [_, statusKey, reportId] = interaction.customId.split('_');
            const report = await Report.findById(reportId);
            let title, color, text;
            if (statusKey === 'analise') { title = '🔍 EM ANÁLISE'; color = 0x3498db; text = 'Staff analisando.'; }
            if (statusKey === 'aceita') { title = '✅ DENÚNCIA DEFERIDA'; color = 0x2ecc71; text = 'Medidas aplicadas.'; }
            if (statusKey === 'negada') { title = '❌ DENÚNCIA INDEFERIDA'; color = 0xed4245; text = 'Falta de provas.'; }
            if (statusKey === 'padrao') { title = '🚫 FORA DOS PADRÕES'; color = 0x95a5a6; text = 'Descumpriu regras.'; }

            const finalEmbed = new EmbedBuilder().setColor(color).setTitle(title).setDescription(text)
                .addFields({ name: '🚫 Acusado', value: `\`${report.accused}\`` }, { name: '📝 Motivo', value: `\`${report.reason}\`` })
                .setFooter({ text: 'Tópico encerrado.' });

            await interaction.update({ embeds: [finalEmbed], components: [] });
        }
    }
};
