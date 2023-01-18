const Base = require("../../base/util/client");
const CommandInterface = require("../../base/templates/command");

module.exports = class Economy extends CommandInterface {
    /**
     * @param {Base} client 
     * @param {import('discord.js').Message} message 
     * @param {Array<string>} args 
     */
    constructor(client) {
        super();
        this.client = client;
        this.name = "resetmoney",
            this.category = "economy",
            this.permission = "Administrator",
            this.description = "Resetajte novac korisniku ili svima."
    };
    /**
     * @param {Base} client 
     * @param {import('discord.js').Message} message 
     * @param {Array<string>} args 
     */
    async execute(message, args) {
        const user = message.mentions.users.first() || this.client.users.cache.find(u => u.id === args[0]) || this.client.users.cache.find(u => u.tag === args[0]) || this.client.users.cache.find(u => u.username === args[0]) || this.client.users.cache.find(u => u.username.toLowerCase() === args[0]) || this.client.users.cache.find(u => u.username.toUpperCase() === args[0]) || this.client.users.cache.find(u => u.username.toLowerCase().includes(args[0])) || this.client.users.cache.find(u => u.username.toUpperCase().includes(args[0]));

        if (!user) {
            await this.client.database.economy.updateMany({ GuildID: message.guild.id }, { Cash: 0, Bank: 0, Transactions: [] })

            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.yes} Resetovali ste novac svima.`,
                "Success"
            )
        } else {
            const userData = await this.client.database.economy.findOne({ GuildID: message.guild.id, UserID: user.id })

            if (!userData)
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Korisnik/ca ${user} nema novca.`,
                    "Error"
                )

            userData.Transactions = [];
            userData.Cash = 0;
            userData.Bank = 0;

            await userData.save()

            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.yes} Resetovali ste novac korisniku ${user}.`,
                "Success"
            )
        }
    }
}