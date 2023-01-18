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
        this.name = "bet",
            this.category = "economy",
            this.description = "Igrajte bet igru."
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

        const user = this.client.util.randomNumber(3, 10);
        const bot = this.client.util.randomNumber(1, 10);

        let isWinner = false;

        if (user > bot) {
            isWinner = true;
        }

        if (isWinner) {
            userData.Cash += beat;
            userData.Transactions.push(`> **[+]** Kockao se na bet igri i zaradio **${this.client.util.cleanNumber(beat)}$**`)
        } else {
            userData.Cash -= beat;
            userData.Transactions.push(`> **[-]** Kockao se na bet igri i izgubio **${this.client.util.cleanNumber(beat)}$**`)
        }

        await userData.save();

        return message.reply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                    .setDescription(`${this.client.emoji.statistic} **INFORMACIJE:**\n> ${this.client.emoji.human} **${message.author.tag}**\n> ${this.client.emoji.diamond} ${isWinner ? `Pobedili ste bet igru i dodano vam je **${this.client.util.cleanNumber(beat)}$**.\n\n${this.client.emoji.folder} **BET:**\n> ${this.client.emoji.globe} Vi ste izabrali broj **${user}**\n> ${this.client.emoji.key} Bot je izabrao broj **${bot}**` : `Izgubili ste bet igru i oduzeto vam je **${this.client.util.cleanNumber(beat)}$**.\n\n${this.client.emoji.folder} **BET:**\n> ${this.client.emoji.globe} Vi ste izabrali broj **${user}**\n> ${this.client.emoji.key} Bot je izabrao broj **${bot}**`}`)
                    .setColor(isWinner ? "#33ff81" : "#ff3838")
                    .setTimestamp()
            ]
        });
    }
}