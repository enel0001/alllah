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
        this.name = "boosters",
            this.category = "economy",
            this.description = "Prikazuje vaše aktivne boostere."
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

            if (!userData || !userData.XPBooster && !userData.EconomyBooster)
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.statistic} **INFORMACIJE:**\n> ${this.client.emoji.human} **${message.author.tag}**\n> ${this.client.emoji.key} Informacije o vašim boosterima.\n\n${this.client.emoji.diamond} **XP BOOSTER:**\n> ${this.client.emoji.disabled} Nema aktivnog boostera.\n\n${this.client.emoji.bank} **ECONOMY BOOSTER:**\n> ${this.client.emoji.disabled} Nema aktivnog boostera.`,
                )

            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.statistic} **INFORMACIJE:**\n> ${this.client.emoji.human} **${message.author.tag}**\n> ${this.client.emoji.key} Informacije o vašim boosterima.\n\n${this.client.emoji.diamond} **XP BOOSTER:**\n${userData.XPBooster === true ? `> ${this.client.emoji.enabled} Status: **Aktivan**\n> ${this.client.emoji.prize} Multiplier: **${userData.XPBoosterMultiplier}x**\n> ${this.client.emoji.clock} Ističe za: ${this.client.util.timeFormat(userData.XPBoosterEnd - Date.now())}` : `> ${this.client.emoji.disabled} Nema aktivnog boostera.`}\n\n${this.client.emoji.bank} **ECONOMY BOOSTER:**\n${userData.EconomyBooster === true ? `> ${this.client.emoji.enabled} Status: **Aktivan**\n> ${this.client.emoji.prize} Multiplier: **${userData.EconomyBoosterMultiplier}x**\n> ${this.client.emoji.clock} Ističe za: ${this.client.util.timeFormat(userData.EconomyBoosterEnd - Date.now())}` : `> ${this.client.emoji.disabled} Nema aktivnog boostera.`}`,
            )
        } else {
            const userData = await this.client.database.economy.findOne({ GuildID: message.guild.id, UserID: user.id });

            if (!userData || !userData.XPBooster && !userData.EconomyBooster)
                return this.client.util.embed(
                    message,
                    "Reply",
                    user,
                    "",
                    `${this.client.emoji.statistic} **INFORMACIJE:**\n> ${this.client.emoji.human} **${user.tag}**\n> ${this.client.emoji.key} Informacije o korisnikovim boosterima.\n\n${this.client.emoji.diamond} **XP BOOSTER:**\n> ${this.client.emoji.disabled} Nema aktivnog boostera.\n\n${this.client.emoji.bank} **ECONOMY BOOSTER:**\n> ${this.client.emoji.disabled} Nema aktivnog boostera.`,
                )

            return this.client.util.embed(
                message,
                "Reply",
                user,
                "",
                `${this.client.emoji.statistic} **INFORMACIJE:**\n> ${this.client.emoji.human} **${user.tag}**\n> ${this.client.emoji.key} Informacije o korisnikovim boosterima.\n\n${this.client.emoji.diamond} **XP BOOSTER:**\n${userData.XPBooster === true ? `> ${this.client.emoji.enabled} Status: **Aktivan**\n> ${this.client.emoji.prize} Multiplier: **${userData.XPBoosterMultiplier}x**\n> ${this.client.emoji.clock} Ističe za: ${this.client.util.timeFormat(userData.XPBoosterEnd - Date.now())}` : `> ${this.client.emoji.disabled} Nema aktivnog boostera.`}\n\n${this.client.emoji.bank} **ECONOMY BOOSTER:**\n${userData.EconomyBooster === true ? `> ${this.client.emoji.enabled} Status: **Aktivan**\n> ${this.client.emoji.prize} Multiplier: **${userData.EconomyBoosterMultiplier}x**\n> ${this.client.emoji.clock} Ističe za: ${this.client.util.timeFormat(userData.EconomyBoosterEnd - Date.now())}` : `> ${this.client.emoji.disabled} Nema aktivnog boostera.`}`,
            )
        }
    }
}