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
        this.name = "balance",
            this.category = "economy",
            this.aliases = ["bal"],
            this.description = "Pogledajte vaš račun."
    };
    /**
     * @param {Base} client 
     * @param {import('discord.js').Message} message 
     * @param {Array<string>} args 
     */
    async execute(message, args) {
        const user = message.mentions.users.first() || this.client.users.cache.find(u => u.id === args[0]) || this.client.users.cache.find(u => u.tag === args[0]) || this.client.users.cache.find(u => u.username === args[0]) || this.client.users.cache.find(u => u.username.toLowerCase() === args[0]) || this.client.users.cache.find(u => u.username.toUpperCase() === args[0]) || this.client.users.cache.find(u => u.username.toLowerCase().includes(args[0])) || this.client.users.cache.find(u => u.username.toUpperCase().includes(args[0]));

        if (!user) {
            const userData = await this.client.database.economy.findOne({ GuildID: message.guild.id, UserID: message.author.id });

            const rank = await this.client.database.economy.find({ GuildID: message.guild.id }).sort({ Cash: -1 }).exec();
            const rankPosition = rank.findIndex((u) => u.UserID === message.author.id) + 1;

            if (!userData || !rankPosition)
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.statistic} **INFORMACIJE:**\n> ${this.client.emoji.human} **${message.author.tag}**\n> ${this.client.emoji.cash} Novčanik: **0$**\n> ${this.client.emoji.bank} Banka: **0$**\n> ${this.client.emoji.transactions} Ukupno: **0$**`
                )

            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.statistic} **INFORMACIJE:**\n> ${this.client.emoji.human} **${message.author.tag}**\n> ${this.client.emoji.cash} Novčanik: **${this.client.util.cleanNumber(userData.Cash)}$**\n> ${this.client.emoji.bank} Banka: **${this.client.util.cleanNumber(userData.Bank)}$**\n> ${this.client.emoji.transactions} Ukupno: **${this.client.util.cleanNumber(userData.Cash + userData.Bank)}$**\n> ${this.client.emoji.key} Rank: **#${rankPosition}**\n\n${this.client.emoji.shield} **TRANSAKCIJE:**\n${userData.Transactions.slice(-5).reverse().join("\n") || "> Korisnik nema transakcije."}`
            )
        } else {
            const userData = await this.client.database.economy.findOne({ GuildID: message.guild.id, UserID: user.id });

            const rank = await this.client.database.economy.find({ GuildID: message.guild.id }).sort({ Cash: -1 }).exec();
            const rankPosition = rank.findIndex((u) => u.UserID === user.id) + 1;

            if (!userData || !rankPosition)
                return this.client.util.embed(
                    message,
                    "Reply",
                    user,
                    "",
                    `${this.client.emoji.statistic} **INFORMACIJE:**\n> ${this.client.emoji.human} **${user.tag}**\n> ${this.client.emoji.cash} Novčanik: **0$**\n> ${this.client.emoji.bank} Banka: **0$**\n> ${this.client.emoji.transactions} Ukupno: **0$**`
                )

            return this.client.util.embed(
                message,
                "Reply",
                user,
                "",
                `${this.client.emoji.statistic} **INFORMACIJE:**\n> ${this.client.emoji.human} **${user.tag}**\n> ${this.client.emoji.cash} Novčanik: **${this.client.util.cleanNumber(userData.Cash)}$**\n> ${this.client.emoji.bank} Banka: **${this.client.util.cleanNumber(userData.Bank)}$**\n> ${this.client.emoji.transactions} Ukupno: **${this.client.util.cleanNumber(userData.Cash + userData.Bank)}$**\n> ${this.client.emoji.key} Rank: **#${rankPosition}**\n\n${this.client.emoji.shield} **TRANSAKCIJE:**\n${userData.Transactions.slice(-5).reverse().join("\n") || "> Korisnik nema transakcije."}`
            )
        }
    }
}