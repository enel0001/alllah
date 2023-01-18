const Base = require("../../base/util/client");
const CommandInterface = require("../../base/templates/command");
const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } = require("discord.js")

module.exports = class Economy extends CommandInterface {
    /**
     * @param {Base} client 
     * @param {import('discord.js').Message} message 
     * @param {Array<string>} args 
     */
    constructor(client) {
        super();
        this.client = client;
        this.name = "crash",
            this.category = "economy",
            this.description = "Igrajte crash igru."
    };
    /**
     * @param {Base} client 
     * @param {import('discord.js').Message} message 
     * @param {Array<string>} args 
     */
    async execute(message, args) {
        let beat = args[0];
        const userData = await this.client.database.economy.findOne({ GuildID: message.guild.id, UserID: message.author.id });

        if (!beat || isNaN(beat) ? beat !== "all" : beat < 50 || beat > 100000000 || beat.includes(".") || beat.includes(",") || beat.includes("-"))
            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.no} Morate uneti barem **50$**.`,
                "Error",
            )

        if (!userData || userData?.Cash < beat)
            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.no} Nemate dovoljno novca da platite opkladu.`,
                "Error",
            )

        if (userData.CrashRunning === true)
            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.no} Već igrate crash igru.`,
                "Error",
            )

        if (beat === "all") {
            beat = userData.Cash;

            if (beat < 50 || beat > 100000000) {
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Nemate dovoljno novca da platite opkladu.`,
                    "Error",
                )
            }
        } else {
            beat = Number.parseInt(beat);
        }

        let multi = 1;
        let profit = beat * multi - beat;
        const rnd = random();

        const Button = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setStyle(ButtonStyle.Danger)
                .setEmoji(this.client.emoji.stop)
                .setLabel("Zaustavi")
                .setCustomId(`button`)
        )

        const Embed = new EmbedBuilder()
            .setColor("#9fa8ff")
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setTimestamp()
            .setDescription(`${this.client.emoji.transactions} **INFORMACIJE:**\n> ${this.client.emoji.human} **${message.author.tag}**\n> ${this.client.emoji.globe} Uložili ste vaš novac u crash igru.\n\n${this.client.emoji.statistic} **U TOKU:**\n> ${this.client.emoji.diamond} Multiplier: **${parseFloat(multi).toFixed(1)}x**\n> ${this.client.emoji.bank} Profit: **${this.client.util.cleanNumber(profit)}$**`)

        await message.reply({ embeds: [Embed], components: [Button] }).then(async m => {
            userData.CrashRunning = true

            await userData.save()

            const interval = setInterval(async () => {
                multi = multi += 0.2
                profit = parseInt(beat * multi - beat);

                const Embed = new EmbedBuilder()
                    .setColor("#9fa8ff")
                    .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                    .setTimestamp()
                    .setDescription(`${this.client.emoji.transactions} **INFORMACIJE:**\n> ${this.client.emoji.human} **${message.author.tag}**\n> ${this.client.emoji.globe} Uložili ste vaš novac u crash igru.\n\n${this.client.emoji.statistic} **U TOKU:**\n> ${this.client.emoji.diamond} Multiplier: **${parseFloat(multi).toFixed(1)}x** \n> ${this.client.emoji.bank} Profit: **${this.client.util.cleanNumber(profit)}$**`)

                if (rnd > multi) {
                    await m.edit({ embeds: [Embed] })
                } else {
                    userData.Cash -= beat;
                    userData.Transactions.push(`> **[-]** Kockao se na crash igri i izgubio **${this.client.util.cleanNumber(beat)}$**`)
                    userData.CrashRunning = false;

                    await userData.save()

                    const Embed2 = new EmbedBuilder()
                        .setColor("#ff3838")
                        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                        .setTimestamp()
                        .setDescription(`${this.client.emoji.transactions} **INFORMACIJE:**\n> ${this.client.emoji.human} **${message.author.tag}**\n> ${this.client.emoji.globe} Uložili ste vaš novac u crash igru.\n\n${this.client.emoji.statistic} **ZAVRŠENO:**\n> ${this.client.emoji.diamond} Multiplier: **${parseFloat(multi).toFixed(1)}x**\n> ${this.client.emoji.bank} Izgubljeni novac: **${this.client.util.cleanNumber(beat)}$**`)

                    await m.edit({ embeds: [Embed2], components: [] });

                    collector.stop()
                    return clearInterval(interval);
                }
            }, 2000)

            const collector = m.createMessageComponentCollector({ componentType: ComponentType.Button });

            collector.on('collect', async i => {
                if (i.user.id === message.author.id)
                    if (i.customId === "button") {
                        if (multi < 1.2) return i.deferUpdate();
                        if (multi === rnd) return i.deferUpdate();

                        clearInterval(interval);
                        collector.stop()

                        userData.Cash += profit;
                        userData.Transactions.push(`> **[+]** Kockao se na crash igri i zaradio **${this.client.util.cleanNumber(profit)}$**`)
                        userData.CrashRunning = false;

                        await userData.save()

                        const Embed3 = new EmbedBuilder()
                            .setColor("#33ff81")
                            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                            .setTimestamp()
                            .setDescription(`${this.client.emoji.transactions} **INFORMACIJE:**\n> ${this.client.emoji.human} **${message.author.tag}**\n> ${this.client.emoji.globe} Uložili ste vaš novac u crash igru.\n\n${this.client.emoji.statistic} **ZAVRŠENO:**\n> ${this.client.emoji.diamond} Multiplier: **${parseFloat(multi).toFixed(1)}x** (**${rnd}**)\n> ${this.client.emoji.bank} Dobijeni novac: **${this.client.util.cleanNumber(profit)}$**`)

                        return await m.edit({ embeds: [Embed3], components: [] });
                    }
            })
        })
    }
}

function random() {
    const chance = Math.floor(Math.random() * 100) + 1;

    if (chance <= 50)
        return 1.2;
    else {
        const array = [1.4, 1.6, 1.8, 2, 2.2, 2.4, 2.6, 2.8, 3, 3.2, 3.4, 3.6, 3.8, 4, 4.2, 4.4, 4.6, 4.8, 5]
        return array[Math.floor(Math.random() * array.length)];
    }
}