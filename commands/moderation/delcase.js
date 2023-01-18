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
        this.name = "delcase",
            this.category = "moderation",
            this.role = this.client.settings.roles.staff,
            this.aliases = ["deletecase", "removecase", "remcase"],
            this.description = "Obrišite određeni slučaj."
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

        await data.delete()

        return this.client.util.embed(
            message,
            "Reply",
            message.author,
            "",
            `${this.client.emoji.yes} Slučaj je uspješno obrisan.`,
            "Success"
        )
    }
}