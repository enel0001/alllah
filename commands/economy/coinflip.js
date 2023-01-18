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
        this.name = "coinflip",
            this.category = "economy",
            this.aliases = ["cf"],
            this.description = "Igrajte coinflip igru."
    };
    /**
     * @param {Base} client 
     * @param {import('discord.js').Message} message 
     * @param {Array<string>} args 
     */
    async execute(message, args) {
        let beat = args[0];
        const passive = args[1];
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

        const string = ["glava", "pismo"];

        if (!passive || !string.includes(passive))
            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.no} Morate uneti stranu na koju igrate. (**glava** ili **pismo**)`,
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

        const random = Math.floor(Math.random() * string.length);
        const randomString = string[random];

        let isWinner = false;

        if (randomString === passive) {
            isWinner = true;
        }

        if (isWinner) {
            userData.Cash += beat;
            userData.Transactions.push(`> **[+]** Kockao se na coinflip igri i zaradio **${this.client.util.cleanNumber(beat)}$**`)
        } else {
            userData.Cash -= beat;
            userData.Transactions.push(`> **[-]** Kockao se na coinflip igri i izgubio **${this.client.util.cleanNumber(beat)}$**`)
        }

        await userData.save();

        return message.reply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                    .setDescription(`${this.client.emoji.transactions} **INFORMACIJE:**\n> ${this.client.emoji.human} **${message.author.tag}**\n> ${this.client.emoji.globe} Uložili ste vaš novac u coinflip igru.\n\n${this.client.emoji.statistic} **COINFLIP:**${isWinner ? `\n> ${this.client.emoji.diamond} Rezultat: **${randomString}**\n> ${this.client.emoji.bank} Profit: **${this.client.util.cleanNumber(beat)}$**` : `\n> ${this.client.emoji.diamond} Rezultat: **${randomString}**\n> ${this.client.emoji.bank} Gubitak: **${this.client.util.cleanNumber(beat)}$**`}`)
                    .setColor(isWinner ? "#33ff81" : "#ff3838")
                    .setTimestamp()
            ]
        })
    }
}