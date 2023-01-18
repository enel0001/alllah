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
        this.name = "roulette",
            this.category = "economy",
            this.description = "Igrajte roulette igru."
    };
    /**
     * @param {Base} client 
     * @param {import('discord.js').Message} message 
     * @param {Array<string>} args 
     */
    async execute(message, args) {
        let beat = args[0];
        const stat = args[1];
        const userData = await this.client.database.economy.findOne({ GuildID: message.guild.id, UserID: message.author.id });

        if (!beat || isNaN(beat) ? beat !== "all" : beat < 50 || beat > 100000000 || beat.includes(".") || beat.includes(",") || beat.includes("-"))
            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.no} Morate uneti barem **50$**.`,
                "Error",
            )

        if (!stat)
            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.no} Morate uneti boju ili broj.`,
                "Error",
            )

        if (!userData || userData?.Cash < beat)
            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.no} Nemate dovoljno novca da platite opkladu.`,
                "Error",
            )

        if (beat === "all") {
            beat = Number.parseInt(userData.Cash);

            if (beat < 50 || beat > 100000000) {
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Nemate dovoljno novca da platite opkladu.`,
                    "Error",
                )
            }
        } else {
            beat = Number.parseInt(beat);
        }

        let colorStat = false;
        let numberStat = false;

        if (isNaN(stat))
            colorStat = true;
        else
            numberStat = true;

        const number = this.client.util.randomNumber(0, 36);

        let multiplier = 0;
        let isWinner = false;

        const deck = {
            0: "green",
            1: "red",
            2: "black",
            3: "red",
            4: "black",
            5: "red",
            6: "black",
            7: "red",
            8: "black",
            9: "red",
            10: "black",
            11: "black",
            12: "red",
            13: "black",
            14: "red",
            15: "black",
            16: "red",
            17: "black",
            18: "red",
            19: "red",
            20: "black",
            21: "red",
            22: "black",
            23: "red",
            24: "black",
            25: "red",
            26: "black",
            27: "red",
            28: "black",
            29: "black",
            30: "red",
            31: "black",
            32: "red",
            33: "black",
            34: "red",
            35: "black",
            36: "red",
        }

        if (colorStat) {
            if (stat !== 'red' && stat !== 'black' && stat !== 'green')
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Morate uneti boju ili broj.`,
                    "Error",
                )

            if (stat === deck[number]) {
                multiplier = stat === 'green' ? 17 : 2;
                isWinner = true;
            }
        } else if (numberStat) {
            if (stat < 0 || stat > 36 || stat.includes(".") || stat.includes(",") || stat.includes("-"))
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Morate uneti boju ili broj.`,
                    "Error",
                )

            if (stat == number) {
                isWinner = true;
                multiplier = stat == 0 ? 35 : stat;
            }
        }

        if (isWinner) {
            userData.Transactions.push(`> **[+]** Kockao se na roulette igri i zaradio **${this.client.util.cleanNumber(beat * multiplier)}$**`)
            userData.Cash += beat * multiplier - beat;

            await userData.save()

            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.transactions} **INFORMACIJE:**\n> ${this.client.emoji.human} **${message.author.tag}**\n> ${this.client.emoji.globe} Uložili ste vaš novac u roulette igru.\n\n${this.client.emoji.statistic} **ROULETTE:**\n> ${this.client.emoji.key} Status: **${deck[number]} ${number}**\n> ${this.client.emoji.diamond} Multiplier: **${multiplier}x**\n> ${this.client.emoji.bank} Profit: **${this.client.util.cleanNumber(beat * multiplier - beat)}$**`,
                "Success",
            )
        } else {
            userData.Transactions.push(`> **[-]** Kockao se na roulette igri i izgubio **${this.client.util.cleanNumber(beat)}$**`)
            userData.Cash -= beat;

            await userData.save()

            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.transactions} **INFORMACIJE:**\n> ${this.client.emoji.human} **${message.author.tag}**\n> ${this.client.emoji.globe} Uložili ste vaš novac u roulette igru.\n\n${this.client.emoji.statistic} **ROULETTE:**\n> ${this.client.emoji.key} Status: **${deck[number]} ${number}**\n> ${this.client.emoji.bank} Gubitak: **${this.client.util.cleanNumber(beat)}$**`,
                "Error",
            )
        }
    }
}