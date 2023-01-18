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
        this.name = "pay",
            this.category = "economy",
            this.description = "Platite novac korisniku/ci."
    };
    /**
     * @param {Base} client 
     * @param {import('discord.js').Message} message 
     * @param {Array<string>} args 
     */
    async execute(message, args) {
        const user = message.mentions.users.first() || this.client.users.cache.find(u => u.id === args[0]) || this.client.users.cache.find(u => u.tag === args[0]) || this.client.users.cache.find(u => u.username === args[0]) || this.client.users.cache.find(u => u.username.toLowerCase() === args[0]) || this.client.users.cache.find(u => u.username.toUpperCase() === args[0]) || this.client.users.cache.find(u => u.username.toLowerCase().includes(args[0])) || this.client.users.cache.find(u => u.username.toUpperCase().includes(args[0]));
        let beat = args[1];
        const userData = await this.client.database.economy.findOne({ GuildID: message.guild.id, UserID: message.author.id });

        if (!user)
            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.no} Morate uneti korisnikovo ime ili ga tagovati.`,
                "Error"
            );

        if (user.id === message.author.id)
            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.no} Ne možete platiti sebi.`,
                "Error"
            );

        if (!beat || isNaN(beat) ? beat !== "all" : beat < 1 || beat > 100000000 || beat.includes(".") || beat.includes(",") || beat.includes("-"))
            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.no} Morate uneti barem **1$**.`,
                "Error",
            )

        if (!userData || userData?.Cash < beat)
            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.no} Nemate dovoljno novca da platite korisniku/ci.`,
                "Error",
            )

        if (beat === "all") {
            beat = Number.parseInt(userData.Cash);

            if (beat < 1 || beat > 100000000) {
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Nemate dovoljno novca da platite korisniku/ci.`,
                    "Error",
                )
            }
        } else {
            beat = Number.parseInt(beat);
        }

        const paidData = await this.client.database.economy.findOne({ GuildID: message.guild.id, UserID: user.id });

        if (!paidData) {
            await new this.client.database.economy({
                GuildID: message.guild.id,
                UserID: user.id,
                Cash: beat,
                Bank: 0,
                Transactions: [`> **[+]** Primljeno **${this.client.util.cleanNumber(beat)}$** od korisnika/ca **${message.author.tag}**.`],
                Work: "",
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
        } else {
            paidData.Cash += beat;
            paidData.Transactions.push(`> **[+]** Primljeno **${this.client.util.cleanNumber(beat)}$** od korisnika/ca **${message.author.tag}**.`)

            await paidData.save()
        }

        userData.Cash -= beat;
        userData.Transactions.push(`> **[-]** Poslano **${this.client.util.cleanNumber(beat)}$** korisniku/ci **${user.tag}**.`)

        await userData.save()

        return this.client.util.embed(
            message,
            "Reply",
            message.author,
            "",
            `${this.client.emoji.yes} Uspešno ste poslali **${this.client.util.cleanNumber(beat)}$** korisniku/ci ${user}`,
            "Success",
        )
    }
}