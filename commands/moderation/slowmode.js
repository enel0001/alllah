const Base = require("../../base/util/client");
const CommandInterface = require("../../base/templates/command");
const ms = require("ms");

module.exports = class Moderation extends CommandInterface {
    /**
     * @param {Base} client 
     * @param {import('discord.js').Message} message 
     * @param {Array<string>} args 
     */
    constructor(client) {
        super();
        this.client = client;
        this.name = "slowmode",
            this.category = "moderation",
            this.role = this.client.settings.roles.staff,
            this.aliases = ["smode"],
            this.description = "Postavite slowmode na kanalu."
    };

    /**
     * @param {Base} client 
     * @param {import('discord.js').Message} message 
     * @param {Array<string>} args 
     */
    async execute(message, args) {
        const number = args[0]

        if (!number)
            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.no} Morate uneti vrijeme`,
                "Error"
            )

        let final = 0;

        if (number.endsWith("s")) {
            final = parseInt(number.replace("s", ""))
        } else if (number.endsWith("m")) {
            final = parseInt(number.replace("m", "")) * 60
        } else if (number.endsWith("h")) {
            final = parseInt(number.replace("h", "")) * 60 * 60
        }

        if (final < 1 || number.includes("off")) {
            message.channel.setRateLimitPerUser(0);

            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.yes} Slowmode je isključen.`,
                "Success"
            )
        }

        if (final > 21600)
            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.no} Slowmode ne može biti veći od 6h.`,
                "Error"
            )

        message.channel.setRateLimitPerUser(final);

        return this.client.util.embed(
            message,
            "Reply",
            message.author,
            "",
            `${this.client.emoji.yes} Slowmode je postavljen na ${this.client.util.timeFormat(final * 1000)}.`,
            "Success"
        )
    }
}