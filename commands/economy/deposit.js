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
        this.name = "deposit",
            this.category = "economy",
            this.aliases = ["dep"],
            this.description = "Ostavite novac u banku."
    };
    /**
     * @param {Base} client 
     * @param {import('discord.js').Message} message 
     * @param {Array<string>} args 
     */
    async execute(message, args) {
        let beat = args[0];
        const userData = await this.client.database.economy.findOne({ GuildID: message.guild.id, UserID: message.author.id });

        if (!beat || isNaN(beat) ? beat !== "all" : beat < 1 || beat > 100000000 || beat.includes(".") || beat.includes(",") || beat.includes("-"))
            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.no} Morate uneti barem **1$**.`,
                "Error",
            )

        if (!userData || userData?.Cash < beat)
            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.no} Nemate dovoljno novca da ostavite u banku.`,
                "Error",
            )

        if (beat === "all") {
            beat = Number.parseInt(userData.Cash);

            if (beat < 1 || beat > 100000000) {
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Nemate dovoljno novca da ostavite u banku.`,
                    "Error",
                )
            }
        } else {
            beat = Number.parseInt(beat);
        }

        userData.Cash -= beat;
        userData.Bank += beat;
        userData.Transactions.push(`> **[-]** Ostavljeno **${this.client.util.cleanNumber(beat)}$** u banku.`)

        await userData.save();

        return this.client.util.embed(
            message,
            "Reply",
            message.author,
            "",
            `${this.client.emoji.yes} Ostavili ste **${this.client.util.cleanNumber(beat)}$** u banku.`,
            "Success",
        )
    }
}