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
        this.name = "work",
            this.category = "economy",
            this.description = "Radite i zaradite novac."
    };
    /**
     * @param {Base} client 
     * @param {import('discord.js').Message} message 
     * @param {Array<string>} args 
     */
    async execute(message, args) {
        const userData = await this.client.database.economy.findOne({ GuildID: message.guild.id, UserID: message.author.id });

        let randomJobs = [
            "trgovac",
            "frizer",
            "gradjevinac",
            "čistač",
            "nastavnik",
            "bolničar",
            "policajac",
            "vatrogasac",
            "taksista",
            "veterinar",
            "blagajnik",
            "koder",
            "muzički urednik",
            "prevodilac",
            "arhitekta",
            "farmaceut",
            "novinar",
            "analiticar",
            "psiholog",
            "doktor",
            "producent",
            "fotograf",
            "mesar",
            "vodoinstalater",
            "konobar",
            "batler",
            "špijun",
            "kaskader",
            "elektroinstalater",
            "računovođa",
            "striptizeta",
            "porno glumac",
            "kuvar",
        ];

        let poso = randomJobs[Math.floor(Math.random() * randomJobs.length)]

        if (!userData) {
            let amount = await this.client.util.randomNumber(0, 1000)

            await new this.client.database.economy({
                GuildID: message.guild.id,
                UserID: message.author.id,
                Cash: amount,
                Bank: 0,
                Transactions: [`> **[+]** Radio kao **${poso}** i zaradio **${this.client.util.cleanNumber(amount)}$**`],
                Work: Date.now(),
                Daily: "",
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
                `${this.client.emoji.statistic} **WORK:**\n> ${this.client.emoji.yes} Radili ste kao **${poso}** na poslu.\n> ${this.client.emoji.plus} Dobili ste **${this.client.util.cleanNumber(amount)}$**.`,
                "Success"
            )
        } else {
            if (userData.Work !== null && 20000 - (Date.now() - userData.Work) > 0) {
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.statistic} **WORK:**\n> ${this.client.emoji.no} Već ste radili na poslu.\n> ${this.client.emoji.clock} Molimo vas sačekajte ${this.client.util.timeFormat(20000 - (Date.now() - userData.Work))}.`,
                    "Error"
                )
            } else {
                let amount = 0;

                if (userData.EconomyBooster === true)
                    amount = await this.client.util.randomNumber(0, (1000 * userData.EconomyBoosterMultiplier));
                else
                    amount = this.client.util.randomNumber(0, 1000)

                userData.Work = Date.now();
                userData.Cash += amount;
                userData.Transactions.push(`> **[+]** Radio kao **${poso}** i zaradio **${this.client.util.cleanNumber(amount)}$**`)

                await userData.save()

                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.statistic} **WORK:**\n> ${this.client.emoji.yes} Radili ste kao **${poso}** na poslu.\n> ${this.client.emoji.plus} Dobili ste **${this.client.util.cleanNumber(amount)}$**. ${userData.EconomyBoosterMultiplier !== 1 ? `(**${userData.EconomyBoosterMultiplier}x**)` : ""}`,
                    "Success"
                )
            }
        }
    }
}