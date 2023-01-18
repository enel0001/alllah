const Base = require("../../base/util/client");
const CommandInterface = require("../../base/templates/command");
const { EmbedBuilder } = require('discord.js')

module.exports = class Moderation extends CommandInterface {
    /**
     * @param {Base} client 
     * @param {import('discord.js').Message} message 
     * @param {Array<string>} args 
     */
    constructor(client) {
        super();
        this.client = client;
        this.name = "unban",
            this.category = "moderation",
            this.aliases = ["ub"],
            this.role = this.client.settings.roles.admin,
            this.description = "Uklonite ban korisniku."
    };

    /**
     * @param {Base} client 
     * @param {import('discord.js').Message} message 
     * @param {Array<string>} args 
     */
    async execute(message, args) {
        const id = args[0]
        const caseid = await this.client.database.moderation.countDocuments() + 1

        if (!id)
            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.no} Morate uneti korisnikov id.`,
                "Error"
            )

        return message.guild.bans.fetch(id).then(async (tag) => {
            return message.guild.members.unban(id).then(async () => {
                new this.client.database.moderation({
                    Guild: message.guild.id,
                    Case: caseid,
                    Action: "Unban",
                    User: id,
                    UserTag: tag.user.tag,
                    Moderator: message.author.id,
                    ModeratorTag: message.author.tag,
                    Reason: "Nema razloga",
                    Date: Date.now(),
                    EndingDate: "",
                }).save()

                this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.statistic} **INFORMACIJE:**\n> ${this.client.emoji.human} **${message.author.tag}**\n> ${this.client.emoji.yes} Uspješno ste unbanovali korisnika/cu sa servera.\n\n${this.client.emoji.globe} **UNBAN:**\n> ${this.client.emoji.human} Korisnik/ca: **${tag.user.tag}**\n> ${this.client.emoji.tools} Slučaj: **Case #${caseid}**`,
                    "Success"
                )

                return this.client.channels.cache.get(this.client.settings.autopost.infractions).send({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                            .setColor("#9fa8ff")
                            .setTimestamp()
                            .setDescription(`${this.client.emoji.statistic} **INFORMACIJE:**\n> ${this.client.emoji.human} **${message.author.tag}**\n> ${this.client.emoji.yes} Korisnik/ca je unbanovao korisnika sa servera.\n\n${this.client.emoji.globe} **UNBAN:**\n> ${this.client.emoji.human} Korisnik/ca: **${tag.user.tag}**\n> ${this.client.emoji.tools} Slučaj: **Case #${caseid}**`)
                    ]
                })
            })
        }).catch((err) => {
            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.no} Korisnik/ca nije banovan/a.`,
                "Error"
            )
        })
    }
}