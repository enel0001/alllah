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
        this.name = "weekly",
            this.category = "economy",
            this.description = "Preuzmite sedmični novac."
    };
    /**
     * @param {Base} client 
     * @param {import('discord.js').Message} message 
     * @param {Array<string>} args 
     */
    async execute(message, args) {
        const userData = await this.client.database.economy.findOne({ GuildID: message.guild.id, UserID: message.author.id });

        let amount = this.client.util.randomNumber(2500, 5000)

        if (!userData) {
            await new this.client.database.economy({
                GuildID: message.guild.id,
                UserID: message.author.id,
                Cash: amount,
                Bank: 0,
                Transactions: [`> **[+]** Preuzeo **${this.client.util.cleanNumber(amount)}$** sedmičnog novca`],
                Work: "",
                Daily: "",
                Weekly: Date.now(),
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
                `${this.client.emoji.statistic} **WEEKLY:**\n> ${this.client.emoji.yes} Preuzeli ste vaš sedmični novac.\n> ${this.client.emoji.plus} Dobili ste **${this.client.util.cleanNumber(amount)}$**.`,
                "Success"
            )
        } else {
            if (userData.Weekly !== null && 604800000 - (Date.now() - userData.Weekly) > 0) {
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.statistic} **WEEKLY:**\n> ${this.client.emoji.no} Već ste preuzeli vaš sedmični novac.\n> ${this.client.emoji.clock} Molimo vas sačekajte ${this.client.util.timeFormat(604800000 - (Date.now() - userData.Weekly))}.`,
                    "Error"
                )
            } else {
                userData.Weekly = Date.now();
                userData.Cash += amount;
                userData.Transactions.push(`> **[+]** Preuzeo **${this.client.util.cleanNumber(amount)}$** sedmičnog novca`)

                await userData.save()

                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.statistic} **WEEKLY:**\n> ${this.client.emoji.yes} Preuzeli ste vaš sedmični novac.\n> ${this.client.emoji.plus} Dobili ste **${this.client.util.cleanNumber(amount)}$**.`,
                    "Success"
                )
            }
        }
    }
}