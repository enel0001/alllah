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
        this.name = "addmoney",
            this.category = "economy",
            this.aliases = ['addcash', "add-money"],
            this.permission = "Administrator",
            this.description = "Dodajte novac korisniku/ci."
    };
    /**
     * @param {Base} client 
     * @param {import('discord.js').Message} message 
     * @param {Array<string>} args 
     */
    async execute(message, args) {
        const user = message.mentions.users.first() || this.client.users.cache.find(u => u.id === args[0]) || this.client.users.cache.find(u => u.tag === args[0]) || this.client.users.cache.find(u => u.username === args[0]) || this.client.users.cache.find(u => u.username.toLowerCase() === args[0]) || this.client.users.cache.find(u => u.username.toUpperCase() === args[0]) || this.client.users.cache.find(u => u.username.toLowerCase().includes(args[0])) || this.client.users.cache.find(u => u.username.toUpperCase().includes(args[0]));
        const beat = Number.parseInt(args[1]);

        if (!user)
            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.no} Morate uneti korisnikovo ime ili ga tagovati.`,
                "Error"
            );

        const userData = await this.client.database.economy.findOne({ GuildID: message.guild.id, UserID: user.id });

        if (!beat || beat < 1 || beat > 100000000)
            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.no} Morate uneti novac.`,
                "Error"
            );

        if (!userData) {
            await new this.client.database.economy({
                GuildID: message.guild.id,
                UserID: message.author.id,
                Cash: beat,
                Bank: 0,
                Transactions: [`> **[+]** Dodano **${this.client.util.cleanNumber(beat)}$** od strane **${message.author.tag}**.`],
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

            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.yes} Dodali ste **${this.client.util.cleanNumber(beat)}$** korisniku/ci ${user}`,
                "Success"
            )
        } else {
            userData.Cash += beat;
            userData.Transactions.push(`> **[+]** Dodano **${this.client.util.cleanNumber(beat)}$** od strane **${message.author.tag}**.`)

            await userData.save()

            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.yes} Dodali ste **${this.client.util.cleanNumber(beat)}$** korisniku/ci ${user}`,
                "Success"
            )
        }
    }
}