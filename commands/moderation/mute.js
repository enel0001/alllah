const Base = require("../../base/util/client");
const CommandInterface = require("../../base/templates/command");
const ms = require("ms");
const { EmbedBuilder } = require("discord.js");

module.exports = class Moderation extends CommandInterface {
    /**
     * @param {Base} client 
     * @param {import('discord.js').Message} message 
     * @param {Array<string>} args 
     */
    constructor(client) {
        super();
        this.client = client;
        this.name = "mute",
            this.category = "moderation",
            this.role = this.client.settings.roles.staff,
            this.aliases = ["timeout", "m"],
            this.description = "Utišajte korisnika/cu."
    };

    /**
     * @param {Base} client 
     * @param {import('discord.js').Message} message 
     * @param {Array<string>} args 
     */
    async execute(message, args) {
        const user = message.mentions.users.first() || this.client.users.cache.find(u => u.id === args[0]) || this.client.users.cache.find(u => u.tag === args[0]) || this.client.users.cache.find(u => u.username === args[0]) || this.client.users.cache.find(u => u.username.toLowerCase() === args[0]) || this.client.users.cache.find(u => u.username.toUpperCase() === args[0]) || this.client.users.cache.find(u => u.username.toLowerCase().includes(args[0])) || this.client.users.cache.find(u => u.username.toUpperCase().includes(args[0]));
        const time = args[1]
        const reason = args.slice(2).join(" ") || "Nema razloga";
        const id = await this.client.database.moderation.countDocuments() + 1

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
                `${this.client.emoji.no} Ne možete utišati mene.`,
                "Error"
            );

        if (user.id === message.author.id)
            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.no} Ne možete utišati sebe.`,
                "Error"
            );

        if (message.author.id !== message.guild.ownerId)
            if (message.guild.members.cache.get(user.id).roles.highest.position >= message.member.roles.highest.position || user.id === message.guild.ownerId)
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Ne možete utišati korisnika/cu koji/a ima veću poziciju od vas.`,
                    "Error"
                );

        if (message.guild.members.cache.get(user.id).permissions.has("ManageMessages"))
            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.no} Ne mogu utišati korisnika/cu.`,
                "Error"
            )

        if (!time)
            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.no} Morate uneti vrijeme.`,
                "Error"
            );

        const timeInMs = ms(time);
        const maxTimeInMs = ms("28d");
        const minTimeInMs = ms("1s");

        if (!timeInMs)
            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.no} Morate uneti vrijeme.`,
                "Error"
            )

        if (timeInMs > maxTimeInMs || timeInMs < minTimeInMs)
            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.no} Vrijeme ne može biti veće od 28 dana ili manje od 1 sekunde.`,
                "Error"
            )

        const member = message.guild.members.cache.get(user.id);

        if (member.isCommunicationDisabled())
            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.no} Korisnik/ca je već utišan.`,
                "Error"
            )

        return await member.timeout(timeInMs, `Case #${id} - ${reason}`).then(async korisnik => {
            new this.client.database.moderation({
                Guild: message.guild.id,
                Case: id,
                Action: "Mute",
                User: user.id,
                UserTag: user.tag,
                Moderator: message.author.id,
                ModeratorTag: message.author.tag,
                Reason: reason,
                Date: Date.now(),
                EndingDate: "",
            }).save()

            this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.statistic} **INFORMACIJE:**\n> ${this.client.emoji.human} **${message.author.tag}**\n> ${this.client.emoji.yes} Uspješno ste utišali korisnika/cu sa servera.\n\n${this.client.emoji.globe} **MUTE:**\n> ${this.client.emoji.human} Korisnik/ca: **${user.tag}**\n> ${this.client.emoji.tools} Slučaj: **Case #${id}**\n> ${this.client.emoji.hammer} Razlog: **${reason}**\n> ${this.client.emoji.clock} Trajanje: ${this.client.util.timeFormat(timeInMs)}`,
                "Success"
            )

            this.client.channels.cache.get(this.client.settings.autopost.infractions).send({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ dynamic: true }) })
                        .setColor("#9fa8ff")
                        .setTimestamp()
                        .setDescription(`${this.client.emoji.statistic} **INFORMACIJE:**\n> ${this.client.emoji.human} **${user.tag}**\n> ${this.client.emoji.yes} Korisnik/ca je utišan/a na serveru.\n\n${this.client.emoji.globe} **MUTE:**\n> ${this.client.emoji.human} Moderator: **${message.author.tag}**\n> ${this.client.emoji.tools} Slučaj: **Case #${id}**\n> ${this.client.emoji.hammer} Razlog: **${reason}**\n> ${this.client.emoji.clock} Trajanje: ${this.client.util.timeFormat(timeInMs)}`)
                ]
            })

            return this.client.users.cache.get(user.id).send({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ dynamic: true }) })
                        .setColor("#9fa8ff")
                        .setTimestamp()
                        .setDescription(`${this.client.emoji.statistic} **INFORMACIJE:**\n> ${this.client.emoji.human} **${user.tag}**\n> ${this.client.emoji.yes} Utišani ste na serveru **${message.guild.name}**.\n> ${this.client.emoji.key} Ukoliko mislite da je ovo greška, javite se moderatoru čiji će podatci biti ispod i tražite unmute.\n\n${this.client.emoji.globe} **MUTE:**\n> ${this.client.emoji.human} Moderator: **${message.author.tag}**\n> ${this.client.emoji.tools} Slučaj: **Case #${id}**\n> ${this.client.emoji.hammer} Razlog: **${reason}**\n> ${this.client.emoji.clock} Trajanje: ${this.client.util.timeFormat(timeInMs)}`)
                ]
            })
        }).catch(async (err) => {
            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.no} Ne mogu utišati korisnika/cu.`,
                "Error"
            )
        })
    }
}