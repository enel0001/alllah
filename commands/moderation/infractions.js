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
        this.name = "infractions",
            this.category = "moderation",
            this.aliases = ["inf", "history"],
            this.description = "Pogledajte infrakcije korisnika/ce."
    };

    /**
     * @param {Base} client 
     * @param {import('discord.js').Message} message 
     * @param {Array<string>} args 
     */
    async execute(message, args) {
        const user = message.mentions.users.first() || this.client.users.cache.find(u => u.id === args[0]) || this.client.users.cache.find(u => u.tag === args[0]) || this.client.users.cache.find(u => u.username === args[0]) || this.client.users.cache.find(u => u.username.toLowerCase() === args[0]) || this.client.users.cache.find(u => u.username.toUpperCase() === args[0]) || this.client.users.cache.find(u => u.username.toLowerCase().includes(args[0])) || this.client.users.cache.find(u => u.username.toUpperCase().includes(args[0]));

        if (!user) {
            const data = await this.client.database.moderation.find({ Guild: message.guild.id, User: message.author.id })

            if (data < 1)
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Ne mogu pronaći infrakcije.`,
                    "Error"
                )

            const Data = await (await Promise.all(data)).reverse();
            const Pages = Math.ceil(Data.length / 3);
            const Embeds = [];

            for (let i = 0; i < Pages; i++) {
                const page = Data.slice(i * 3, (i + 1) * 3).map((user) => {
                    return `${this.client.emoji.globe} **SLUČAJ #${user.Case}:**\n> ${this.client.emoji.key} Vrsta slučaja: **${user.Action}**\n> ${this.client.emoji.human} Moderator: **${user.ModeratorTag}**\n> ${this.client.emoji.hammer} Razlog: **${user.Reason}**\n> ${this.client.emoji.clock} Slučaj zabilježen: prije ${this.client.util.timeFormat(Date.now() - user.Date)}\n`
                });

                const bans = data.filter(s => s.Action === "Ban").length
                const kicks = data.filter(s => s.Action === "Kick").length
                const mutes = data.filter(s => s.Action === "Mute").length
                const warns = data.filter(s => s.Action === "Warn").length
                const unmutes = data.filter(s => s.Action === "Unmute").length
                const tempbans = data.filter(s => s.Action === "Temp Ban").length

                Embeds.push(
                    new EmbedBuilder()
                        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                        .setColor("#9fa8ff")
                        .setTimestamp()
                        .setDescription(`${this.client.emoji.statistic} **INFORMACIJE:**\n> ${this.client.emoji.human} **${message.author.tag}**\n> ${this.client.emoji.valid} Korisnik/ca ima ukupno **${data.length}** infrakcija.\n> ${this.client.emoji.settings} **${bans}** banova, **${tempbans}** privremenih banova, **${kicks}** izbačaja, **${mutes}** utišanja, **${unmutes}** uklonjena utišanja, **${warns}** upozorenja\n\n${page.join("\n")}`)
                )
            };

            await this.client.paginate.buttons(this.client, message, Embeds);
        } else {
            if (!message.member.roles.cache.has(this.client.settings.roles.staff) && !message.member.permissions.has("Administrator"))
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Potreban vam je role <@&1013529632617795754> ili permisija \`Administrator\` za korištenje ove komande.`,
                    "Error"
                )

            const data = await this.client.database.moderation.find({ Guild: message.guild.id, User: user.id })

            if (data < 1)
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Ne mogu pronaći infrakcije.`,
                    "Error"
                )

            const Data = await (await Promise.all(data)).reverse();
            const Pages = Math.ceil(Data.length / 3);
            const Embeds = [];

            for (let i = 0; i < Pages; i++) {
                const page = Data.slice(i * 3, (i + 1) * 3).map((user, i) => {
                    return `${this.client.emoji.globe} **SLUČAJ #${user.Case}:**\n> ${this.client.emoji.key} Vrsta slučaja: **${user.Action}**\n> ${this.client.emoji.human} Moderator: **${user.ModeratorTag}**\n> ${this.client.emoji.hammer} Razlog: **${user.Reason}**\n> ${this.client.emoji.clock} Slučaj zabilježen: prije ${this.client.util.timeFormat(Date.now() - user.Date)}\n`
                });

                const bans = data.filter(s => s.Action === "Ban").length
                const kicks = data.filter(s => s.Action === "Kick").length
                const mutes = data.filter(s => s.Action === "Mute").length
                const warns = data.filter(s => s.Action === "Warn").length
                const unmutes = data.filter(s => s.Action === "Unmute").length
                const tempbans = data.filter(s => s.Action === "Temp Ban").length

                Embeds.push(
                    new EmbedBuilder()
                        .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ dynamic: true }) })
                        .setColor("#9fa8ff")
                        .setTimestamp()
                        .setDescription(`${this.client.emoji.statistic} **INFORMACIJE:**\n> ${this.client.emoji.human} **${user.tag}**\n> ${this.client.emoji.valid} Korisnik/ca ima ukupno **${data.length}** infrakcija.\n> ${this.client.emoji.settings} **${bans}** banova, **${tempbans}** privremenih banova, **${kicks}** izbačaja, **${mutes}** utišanja, **${unmutes}** uklonjena utišanja, **${warns}** upozorenja\n\n${page.join("\n")}`)
                )
            };

            await this.client.paginate.buttons(this.client, message, Embeds);
        }
    }
}