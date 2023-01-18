const Base = require("../../base/util/client");
const CommandInterface = require("../../base/templates/command");

module.exports = class Staff extends CommandInterface {
    /**
     * @param {Base} client 
     * @param {import('discord.js').Message} message 
     * @param {Array<string>} args 
     */
    constructor(client) {
        super();
        this.client = client;
        this.name = "dajplus",
            this.category = "staff",
            this.permission = "Administrator",
            this.aliases = ["addplus"],
            this.description = "Dodajte plus staff korisniku/ci."
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

        if (user.id === this.client.user.id)
            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.no} Ne možete dati plus meni.`,
                "Error"
            );

        if (user.id === message.author.id)
            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.no} Ne možete dati plus sami sebi.`,
                "Error"
            );

        if (!message.guild.members.cache.get(user.id).roles.cache.has(this.client.settings.roles.staff))
            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.no} Korisnik/ca nije član/ica staff tima.`,
                "Error"
            );

        const data = await this.client.database.staff.findOne({ Guild: message.guild.id, User: user.id });

        if (!data) {
            new this.client.database.staff({
                Guild: message.guild.id,
                User: user.id,
                Plus: 1,
                Minus: 0,
                History: [`> **[${new Date().toLocaleString()}]** Dodan **plus** od strane korisnika/ce **${message.author.tag}**.`],
                DutyStatus: false,
                DutyStart: 0,
                DutyTime: 0,
                DutyToday: 0,
            }).save();

            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.yes} Uspješno ste dodali **plus** staff korisniku/ci.`,
                "Success"
            );
        } else {
            data.Plus += 1;
            data.History.push(`> **[${new Date().toLocaleString()}]** Dodan **plus** od strane korisnika/ce **${message.author.tag}**.`);
            data.save();

            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.yes} Uspješno ste dodali **plus** staff korisniku/ci.`,
                "Success"
            );
        }
    }
}