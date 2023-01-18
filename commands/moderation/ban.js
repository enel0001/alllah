const Base = require("../../base/util/client");
const CommandInterface = require("../../base/templates/command");
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
        this.name = "ban",
            this.category = "moderation",
            this.aliases = ["b"],
            this.role = this.client.settings.roles.admin,
            this.description = "Banujte korisnika/cu."
    };

    /**
     * @param {Base} client 
     * @param {import('discord.js').Message} message 
     * @param {Array<string>} args 
     */
    async execute(message, args) {
        const user = message.mentions.users.first() || this.client.users.cache.find(u => u.id === args[0]) || this.client.users.cache.find(u => u.tag === args[0]) || this.client.users.cache.find(u => u.username === args[0]) || this.client.users.cache.find(u => u.username.toLowerCase() === args[0]) || this.client.users.cache.find(u => u.username.toUpperCase() === args[0]) || this.client.users.cache.find(u => u.username.toLowerCase().includes(args[0])) || this.client.users.cache.find(u => u.username.toUpperCase().includes(args[0]));
        const reason = args.slice(1).join(" ") || "Nema razloga";
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
                `${this.client.emoji.no} Ne možete banovati mene.`,
                "Error"
            );

        if (user.id === message.author.id)
            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.no} Ne možete banovati sebe.`,
                "Error"
            );

        if (message.author.id !== message.guild.ownerId)
            if (message.guild.members.cache.get(user.id).roles.highest.position >= message.member.roles.highest.position || user.id === message.guild.ownerId)
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Ne možete banovati korisnika/cu koji/a ima veću poziciju od vas.`,
                    "Error"
                );

        if (message.guild.members.cache.get(user.id).roles.highest.position >= message.guild.members.cache.get(this.client.user.id).roles.highest.position)
            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.no} Ne možete banovati korisnika/cu koji/a ima veću poziciju od mene.`,
                "Error"
            );

        this.client.users.cache.get(user.id).send({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                    .setColor("#9fa8ff")
                    .setTimestamp()
                    .setDescription(`${this.client.emoji.statistic} **INFORMACIJE:**\n> ${this.client.emoji.human} **${user.tag}**\n> ${this.client.emoji.yes} Banovani ste na serveru **${message.guild.name}**.\n> ${this.client.emoji.key} Ukoliko mislite da je ovo greška, javite se moderatoru čiji će podatci biti ispod i tražite unban.\n\n${this.client.emoji.globe} **BAN:**\n> ${this.client.emoji.human} Moderator: **${message.author.tag}**\n> ${this.client.emoji.tools} Slučaj: **Case #${id}**\n> ${this.client.emoji.hammer} Razlog: **${reason}**`)
            ]
        }).then(async (m) => {
            await message.guild.bans.create(user.id, { reason: `Case #${id} - ${reason}` }).then((b) => {
                new this.client.database.moderation({
                    Guild: message.guild.id,
                    Case: id,
                    Action: "Ban",
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
                    `${this.client.emoji.statistic} **INFORMACIJE:**\n> ${this.client.emoji.human} **${message.author.tag}**\n> ${this.client.emoji.yes} Uspješno ste banovali korisnika/cu sa servera.\n\n${this.client.emoji.globe} **BAN:**\n> ${this.client.emoji.human} Korisnik/ca: **${user.tag}**\n> ${this.client.emoji.tools} Slučaj: **Case #${id}**\n> ${this.client.emoji.hammer} Razlog: **${reason}**`,
                    "Success"
                );

                this.client.channels.cache.get(this.client.settings.autopost.infractions).send({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ dynamic: true }) })
                            .setColor("#9fa8ff")
                            .setTimestamp()
                            .setDescription(`${this.client.emoji.statistic} **INFORMACIJE:**\n> ${this.client.emoji.human} **${user.tag}**\n> ${this.client.emoji.yes} Korisnik/ca je banovan/a sa servera.\n\n${this.client.emoji.globe} **BAN:**\n> ${this.client.emoji.human} Moderator: **${message.author.tag}**\n> ${this.client.emoji.tools} Slučaj: **Case #${id}**\n> ${this.client.emoji.hammer} Razlog: **${reason}**`)
                    ]
                })
            }).catch(async (err) => {
                await m.delete()

                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Ne mogu banovati korisnika/cu.`,
                    "Error"
                )
            })
        }).catch(async (e) => {
            await message.guild.bans.create(user.id, { reason: `Case #${id} - ${reason}` }).then((b) => {
                new this.client.database.moderation({
                    Guild: message.guild.id,
                    Case: id,
                    Action: "Ban",
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
                    `${this.client.emoji.statistic} **INFORMACIJE:**\n> ${this.client.emoji.human} **${message.author.tag}**\n> ${this.client.emoji.yes} Uspješno ste banovali korisnika/cu sa servera.\n\n${this.client.emoji.globe} **BAN:**\n> ${this.client.emoji.human} Korisnik/ca: **${user.tag}**\n> ${this.client.emoji.tools} Slučaj: **Case #${id}**\n> ${this.client.emoji.hammer} Razlog: **${reason}**`,
                    "Success"
                );

                this.client.channels.cache.get(this.client.settings.autopost.infractions).send({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ dynamic: true }) })
                            .setColor("#9fa8ff")
                            .setTimestamp()
                            .setDescription(`${this.client.emoji.statistic} **INFORMACIJE:**\n> ${this.client.emoji.human} **${user.tag}**\n> ${this.client.emoji.yes} Korisnik/ca je banovan/a sa servera.\n\n${this.client.emoji.globe} **BAN:**\n> ${this.client.emoji.human} Moderator: **${message.author.tag}**\n> ${this.client.emoji.tools} Slučaj: **Case #${id}**\n> ${this.client.emoji.hammer} Razlog: **${reason}**`)
                    ]
                })
            }).catch((err) => {
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Ne mogu banovati korisnika/cu.`,
                    "Error"
                )
            })
        })
    }
}