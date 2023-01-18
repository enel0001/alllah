const Base = require("../../base/util/client");
const EventInterface = require("../../base/templates/event");
const { EmbedBuilder } = require("discord.js")

module.exports = class ClientEvent extends EventInterface {
    /**
     * @param {Base} client 
     */
    constructor(client) {
        super()
        this.client = client;
        this.name = "messageReactionAdd"
    };
    async execute(reaction, user) {
        if (user.bot)
            return;

        if (reaction.message.partial)
            await reaction.message.fetch();

        if (reaction.partial)
            await reaction.fetch();

        if (reaction.message.channel.type === 'dm')
            return;

        const message = reaction.message;

        if (!message)
            return;

        const needed = 3;
        const starboard = await this.client.database.starboard.findOne({ GuildID: message.guild.id, MessageID: message.id });

        const statusData = await this.client.database.guild.findOne({ GuildID: this.client.config.guild })

        if (!statusData)
            return;

        if (statusData.Starboard === true) {
            if (reaction && reaction.emoji.name === '⭐' && reaction.count === needed) {
                if (!starboard) {
                    const Embed = new EmbedBuilder()
                        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                        .setColor("Yellow")
                        .setThumbnail(message.author.displayAvatarURL({ size: 2048, dynamic: true }))
                        .setImage(message.attachments.first()?.proxyURL || null)
                        .setDescription(`${this.client.emoji.statistic} **INFORMACIJE:**\n> ${this.client.emoji.human} **${message.author.tag}**\n> ${this.client.emoji.crown} Korisnikova poruka ima **${needed}** reakcije/u.\n\n${this.client.emoji.diamond} **STARBOARD:**\n> ${this.client.emoji.key} Poruka: **${message.content || "Slika"}**\n> ${this.client.emoji.valid} Ukupan broj reakcija: **${reaction.count}**\n> ${this.client.emoji.bell} Link: [Kliknite da odete do poruke](${message.url})`)

                    this.client.channels.cache.get(this.client.settings.starboard)
                        .send({ embeds: [Embed] })
                        .then(async (embedMessage) => {
                            new this.client.database.starboard({
                                GuildID: message.guild.id,
                                MessageID: message.id,
                                EmbedID: embedMessage.id,
                                AuthorID: message.author.id,
                                Posted: true,
                            }).save()
                        });
                }
            } else if (reaction && reaction.emoji.name === '⭐' && reaction.count > needed) {
                if (starboard) {
                    const messageEmbed = await message.guild.channels.cache.get(this.client.settings.starboard).messages.fetch(starboard.EmbedID);

                    const Embed = new EmbedBuilder()
                        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                        .setColor("Yellow")
                        .setThumbnail(message.author.displayAvatarURL({ size: 2048, dynamic: true }))
                        .setImage(message.attachments.first()?.proxyURL || null)
                        .setDescription(`${this.client.emoji.statistic} **INFORMACIJE:**\n> ${this.client.emoji.human} **${message.author.tag}**\n> ${this.client.emoji.crown} Korisnikova poruka ima više od **${needed}** reakcije/u.\n\n${this.client.emoji.diamond} **STARBOARD:**\n> ${this.client.emoji.key} Poruka: **${message.content || "Slika"}**\n> ${this.client.emoji.valid} Ukupan broj reakcija: **${reaction.count}**\n> ${this.client.emoji.bell} Link: [Kliknite da odete do poruke](${message.url})`)

                    await messageEmbed.edit({ embeds: [Embed] })
                }
            }
        }
    }
}