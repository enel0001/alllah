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
        this.name = "rob",
            this.category = "economy",
            this.description = "Opljačkajte korisnika/cu."
    };
    /**
     * @param {Base} client 
     * @param {import('discord.js').Message} message 
     * @param {Array<string>} args 
     */
    async execute(message, args) {
        const user = message.mentions.users.first() || this.client.users.cache.find(u => u.id === args[0]) || this.client.users.cache.find(u => u.tag === args[0]) || this.client.users.cache.find(u => u.username === args[0]) || this.client.users.cache.find(u => u.username.toLowerCase() === args[0]) || this.client.users.cache.find(u => u.username.toUpperCase() === args[0]) || this.client.users.cache.find(u => u.username.toLowerCase().includes(args[0])) || this.client.users.cache.find(u => u.username.toUpperCase().includes(args[0]));

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
                `${this.client.emoji.no} Ne možete opljačkati sebe.`,
                "Error"
            );

        const userData = await this.client.database.economy.findOne({ GuildID: message.guild.id, UserID: message.author.id });
        const robData = await this.client.database.economy.findOne({ GuildID: message.guild.id, UserID: user.id });

        if (!userData || userData?.Cash < 100)
            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.no} Treba vam **100$** da pljačkate.`,
                "Error"
            );

        if (!robData || robData?.Cash < 100)
            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.no} Korisniku/ci treba minimalno **100$**.`,
                "Error"
            );

        const robResult = [
            true,
            false
        ]

        const result = robResult[Math.floor(Math.random() * robResult.length)];
        const caughtAmount = this.client.util.randomNumber(100, userData.Cash);
        const robAmount = this.client.util.randomNumber(100, robData.Cash);

        if (userData.Rob !== null && 300000 - (Date.now() - userData.Rob) > 0) {
            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.statistic} **ROB:**\n> ${this.client.emoji.no} Već ste opljačkali korisnika/cu.\n> ${this.client.emoji.clock} Molimo vas sačekajte ${this.client.util.timeFormat(300000 - (Date.now() - userData.Rob))}.`,
                "Error"
            )
        } else {
            if (result === true) {
                userData.Cash -= caughtAmount;
                userData.Rob = Date.now();
                userData.Transactions.push(`> **[-]** Izgubljeno **${this.client.util.cleanNumber(caughtAmount)}$** zbog neuspješne pljačke.`);

                await userData.save();

                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.statistic} **ROB:**\n> ${this.client.emoji.no} Niste uspjeli opljačkati korisnika/cu.\n> ${this.client.emoji.minus} Izgubili ste **${this.client.util.cleanNumber(caughtAmount)}$**.`,
                    "Error"
                )
            } else {
                userData.Cash += robAmount;
                userData.Rob = Date.now();
                userData.Transactions.push(`> **[+]** Pokrali ste korisnika/cu **${user.tag}** i uzeli mu **${this.client.util.cleanNumber(robAmount)}$**.`);

                await userData.save();

                robData.Cash -= robAmount;
                robData.Transactions.push(`> **[-]** Pokradeni ste od strane korisnika/ce **${message.author.tag}** i izgubili ste **${this.client.util.cleanNumber(robAmount)}$**.`);

                await robData.save();

                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.statistic} **ROB:**\n> ${this.client.emoji.yes} Uspješno ste opljačkali korisnika/cu.\n> ${this.client.emoji.plus} Dobili ste **${this.client.util.cleanNumber(robAmount)}$**.`,
                    "Success"
                )
            }
        }
    }
}