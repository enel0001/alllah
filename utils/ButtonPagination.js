const { EmbedBuilder, ComponentType, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js")

module.exports = async (client, message, embeds) => {
    if (embeds.length <= 0) {
        return client.embed(
            message,
            "Reply",
            message.author,
            "",
            `${client.emoji.no} Došlo je do problema, pokušajte ponovo.`,
            "Error",
        )
    }

    if (embeds.length === 1) return message.reply({ embeds: [embeds[0]] })

    let current = 0;

    const Button = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(client.emoji.left)
            .setCustomId(`previous`),

        new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(client.emoji.stop)
            .setCustomId(`end`),

        new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(client.emoji.right)
            .setCustomId(`next`)
    )

    const ButtonDisabled = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(client.emoji.left)
            .setDisabled(true)
            .setCustomId(`previous`),

        new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(client.emoji.stop)
            .setDisabled(true)
            .setCustomId(`end`),

        new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(client.emoji.right)
            .setDisabled(true)
            .setCustomId(`next`)
    )

    const Pages = embeds;

    const m = await message.reply({ embeds: [Pages[current].setFooter({ text: `Strana ${current + 1}/${Pages.length}` })], components: [Button] })
    const collector = m.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 });

    collector.on('collect', async int => {
        if (int.user.id === message.author.id) {
            collector.resetTimer();

            if (int.customId === "next") current++
            if (int.customId === "previous") current--
            if (int.customId === "end") collector.stop()

            if (current < 0) current = 0;
            if (current >= Pages.length) current = 0;

            m.edit({ embeds: [Pages[current].setFooter({ text: `Strana ${current + 1}/${Pages.length}` })] }).catch(() => { });
            int.deferUpdate();
        }
    })

    collector.on('end', async () => {
        return await m.edit({ embeds: [Pages[current]], components: [ButtonDisabled] })
    })
};
