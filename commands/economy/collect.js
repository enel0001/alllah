const Base = require("../../base/util/client");
const CommandInterface = require("../../base/templates/command");
const ms = require("parse-ms-2");

module.exports = class Economy extends CommandInterface {
    /**
     * @param {Base} client 
     * @param {import('discord.js').Message} message 
     * @param {Array<string>} args 
     */
    constructor(client) {
        super();
        this.client = client;
        this.name = "collect",
            this.category = "economy",
            this.aliases = ["income"],
            this.description = "Preuzmite vaš novac od income rolova."
    };
    /**
     * @param {Base} client 
     * @param {import('discord.js').Message} message 
     * @param {Array<string>} args 
     */
    async execute(message, args) {
        const userData = await this.client.database.economy.findOne({ GuildID: message.guild.id, UserID: message.author.id });

        if (!userData)
            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.no} Nemate rolova za preuzimanje.`,
                "Error",
            )

        let content = ""
        let totaltimetout = ""

        let total = 0;

        await this.client.settings.income.forEach(data => {
            message.guild.roles.cache.forEach(async role => {
                if (!data.role.includes(role.id))
                    return;

                if (message.member.roles.cache.has(role.id)) {
                    if (data.time - (Date.now() - userData[data.name]) > 0) {
                        const time = ms(data.time - (Date.now() - userData[data.name]));

                        if (time.hours === 0)
                            return totaltimetout += `> <@&${data.role}> Možete pokupiti ponovo za ${this.client.emoji.clock} **${time.minutes}** minuta i **${time.seconds}** sekundi.\n`
                        else if (time.hours !== 0)
                            return totaltimetout += `> <@&${data.role}> Možete pokupiti ponovo za ${this.client.emoji.clock} **${time.hours}** sati, **${time.minutes}** minuta i **${time.seconds}** sekundi.\n`
                    }

                    total += data.income;

                    userData.Bank += data.income
                    userData[data.name] = Date.now()

                    content += `> <@&${data.role}> Preuzeto ${this.client.emoji.bank} **${this.client.util.cleanNumber(data.income)}$** income novca. (**banka**)\n`
                }
            })
        })

        await this.client.util.sleep(10)

        if (totaltimetout !== "" && content !== "") {
            if (total !== 0)
                userData.Transactions.push(`> **[+]** Pokupljeno **${this.client.util.cleanNumber(total)}$** od income rolova.`)

            userData.save()

            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.statistic} **INFORMACIJE:**\n> ${this.client.emoji.human} **${message.author.tag}**\n> ${this.client.emoji.valid} Informacije o pokupljanju su ispod.\n\n${this.client.emoji.key} **INCOME:**\n${content}\n${this.client.emoji.locked} **TIMEOUT:**\n${totaltimetout}`
            )
        } else if (content !== "") {
            if (total !== 0)
                userData.Transactions.push(`> **[+]** Pokupljeno **${this.client.util.cleanNumber(total)}$** od income rolova`)

            userData.save()

            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.statistic} **INFORMACIJE:**\n> ${this.client.emoji.human} **${message.author.tag}**\n> ${this.client.emoji.valid} Informacije o pokupljanju su ispod.\n\n${this.client.emoji.key} **INCOME:**\n${content}`
            )
        } else if (totaltimetout !== "") {
            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.statistic} **INFORMACIJE:**\n> ${this.client.emoji.human} **${message.author.tag}**\n> ${this.client.emoji.valid} Informacije o pokupljanju su ispod.\n\n${this.client.emoji.key} **TIMEOUT:**\n${totaltimetout}`
            )
        } else {
            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.no} Nemate rolova za preuzimanje.`,
                "Error",
            )
        }
    }
}