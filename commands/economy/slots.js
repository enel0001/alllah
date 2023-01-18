const Base = require("../../base/util/client");
const CommandInterface = require("../../base/templates/command");
const { EmbedBuilder } = require("discord.js")

module.exports = class Economy extends CommandInterface {
    /**
     * @param {Base} client 
     * @param {import('discord.js').Message} message 
     * @param {Array<string>} args 
     */
    constructor(client) {
        super();
        this.client = client;
        this.name = "slots",
            this.category = "economy",
            this.aliases = ['slotmachine'],
            this.description = "Igrajte slot machine igru."
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

        if (beat === "all") {
            beat = Number.parseInt(userData.Cash);

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

        const emojis = ["🍒", "🍊", "🍉", "🍋", "🍇"];

        const lines = {
            0: ["", "", ""].map(() => emojis[Math.floor(Math.random() * emojis.length)]),
            1: ["", "", ""].map(() => emojis[Math.floor(Math.random() * emojis.length)]),
            2: ["", "", ""].map(() => emojis[Math.floor(Math.random() * emojis.length)])
        };

        let isWinner = false;

        for (let i = 0; i < 3; i++) {
            if (lines[i].every(x => x === lines[i][0])) {
                isWinner = true;
                break;
            }
        }

        if (isWinner) {
            userData.Cash += beat;
            userData.Transactions.push(`> **[+]** Kockao se na slots igri i zaradio **${this.client.util.cleanNumber(beat)}$**`)
        } else {
            userData.Cash -= beat;
            userData.Transactions.push(`> **[-]** Kockao se na slots igri i izgubio **${this.client.util.cleanNumber(beat)}$**`)
        }

        await userData.save();

        return message.reply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                    .setDescription(`${this.client.emoji.statistic} **INFORMACIJE:**\n> ${this.client.emoji.human} **${message.author.tag}**\n> ${this.client.emoji.diamond} ${isWinner ? `Pobedili ste slot machine igru i dodato vam je **${this.client.util.cleanNumber(beat)}$**` : `Izgubili ste slot machine igru i oduzeto vam je **${this.client.util.cleanNumber(beat)}$**`}\n\n${this.client.emoji.prize} **SLOT MACHINE:**\n>>> ⬛ ⬛ ⬛\n${(Object.values(lines).map(x => x.join(" ")).join("\n"))}\n ⬛ ⬛ ⬛`)
                    .setColor(isWinner ? "#33ff81" : "#ff3838")
                    .setTimestamp()
            ]
        });
    }
}