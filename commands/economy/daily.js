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
        this.name = "daily",
            this.category = "economy",
            this.description = "Preuzmite dnevni novac."
    };
    /**
     * @param {Base} client 
     * @param {import('discord.js').Message} message 
     * @param {Array<string>} args 
     */
    async execute(message, args) {
        const userData = await this.client.database.economy.findOne({ GuildID: message.guild.id, UserID: message.author.id });

        let amount = this.client.util.randomNumber(1000, 2500)

        if (!userData) {
            await new this.client.database.economy({
                GuildID: message.guild.id,
                UserID: message.author.id,
                Cash: amount,
                Bank: 0,
                Transactions: [`> **[+]** Preuzeo **${this.client.util.cleanNumber(amount)}$** dnevnog novca`],
                Work: "",
                Daily: Date.now(),
                Weekly: "",
                CrashRunning: false,
                BlackJackRunning: false,
                Crime: "",
                Rob: "",
                EconomyBooster: false,
                EconomyBoosterEnd: "",
                EconomyBoosterMultiplier: 1,
                XPBooster: false,
                XPBoosterEnd: "",
                XPBoosterMultiplier: 1,
                Hero: "",
                King: "",
                Ruby: "",
                Diamond: "",
                Legend: "",
                Emerald: "",
                Challenger: "",
                Spartan: "",
                Immortal: "",
                Master: ""
            }).save()

            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.statistic} **DAILY:**\n> ${this.client.emoji.yes} Preuzeli ste vaš dnevni novac.\n> ${this.client.emoji.plus} Dobili ste **${this.client.util.cleanNumber(amount)}$**.`,
                "Success"
            )
        } else {
            if (userData.Daily !== null && 86400000 - (Date.now() - userData.Daily) > 0) {
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.statistic} **DAILY:**\n> ${this.client.emoji.no} Već ste preuzeli vaš dnevni novac.\n> ${this.client.emoji.clock} Molimo vas sačekajte ${this.client.util.timeFormat(86400000 - (Date.now() - userData.Daily))}.`,
                    "Error"
                )
            } else {
                userData.Daily = Date.now();
                userData.Cash += amount;
                userData.Transactions.push(`> **[+]** Preuzeo **${this.client.util.cleanNumber(amount)}$** dnevnog novca`)

                await userData.save()

                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.statistic} **DAILY:**\n> ${this.client.emoji.yes} Preuzeli ste vaš dnevni novac.\n> ${this.client.emoji.plus} Dobili ste **${this.client.util.cleanNumber(amount)}$**.`,
                    "Success"
                )
            }
        }
    }
}