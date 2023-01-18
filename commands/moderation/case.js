const Base = require("../../base/util/client");
const CommandInterface = require("../../base/templates/command");

module.exports = class Moderation extends CommandInterface {
    /**
     * @param {Base} client 
     * @param {import('discord.js').Message} message 
     * @param {Array<string>} args 
     */
    constructor(client) {
        super();
        this.client = client;
        this.name = "case",
            this.category = "moderation",
            this.role = this.client.settings.roles.staff,
            this.aliases = ["caseinfo"],
            this.description = "Pogledajte informacije o slučaju."
    };

    /**
     * @param {Base} client 
     * @param {import('discord.js').Message} message 
     * @param {Array<string>} args 
     */
    async execute(message, args) {
        const id = Number.parseInt(args[0])

        if (!id)
            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.no} Morate uneti ID slučaja.`,
                "Error"
            )

        if (id < 1)
            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.no} ID slučaja mora biti veći od 1.`,
                "Error"
            )

        const data = await this.client.database.moderation.findOne({ Guild: message.guild.id, Case: id })

        if (!data)
            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.no} Nema slučaja s tim ID-om.`,
                "Error"
            )

        return this.client.util.embed(
            message,
            "Reply",
            message.author,
            "",
            `${this.client.emoji.statistic} **INFORMACIJE:**\n> ${this.client.emoji.human} **${message.author.tag}**\n> ${this.client.emoji.yes} Pregledavate slučaj koji nosi id **${id}**\n\n${this.client.emoji.globe} **SLUČAJ:**\n> ${this.client.emoji.key} Vrsta slučaja: **${data.Action}**\n> ${this.client.emoji.human} Korisnik/ca: **${data.UserTag}**\n> ${this.client.emoji.settings} Moderator: **${data.ModeratorTag}**\n> ${this.client.emoji.hammer} Razlog: **${data.Reason}**\n> ${this.client.emoji.clock} Slučaj je kreiran: prije ${this.client.util.timeFormat(Date.now() - data.Date)}`,
        )
    }
}