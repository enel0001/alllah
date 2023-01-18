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
        this.name = "purge",
            this.category = "moderation",
            this.role = this.client.settings.roles.staff,
            this.aliases = ["clear"],
            this.description = "Obrišite poruke iz kanala."
    };

    /**
     * @param {Base} client 
     * @param {import('discord.js').Message} message 
     * @param {Array<string>} args 
     */
    async execute(message, args) {
        const number = Number.parseInt(args[0])

        if (!number)
            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.no} Morate uneti broj poruka.`,
                "Error"
            )

        if (number < 1 || number > 100)
            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.no} Broj poruka mora biti veći od 1 i manji od 100.`,
                "Error"
            )

        const fetch = await message.channel.messages.fetch({ limit: number });
        const deletedMessages = await message.channel.bulkDelete(fetch, true);

        return this.client.util.embed(
            message,
            "Send",
            message.author,
            "",
            `${this.client.emoji.yes} Uspješno obrisano **${deletedMessages.size}** poruka iz kanala.`,
            "Success"
        )
    }
}