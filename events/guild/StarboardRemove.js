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
        this.name = "messageReactionRemove"
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

        const starboard = await this.client.database.starboard.findOne({ GuildID: message.guild.id, MessageID: message.id });

        const statusData = await this.client.database.guild.findOne({ GuildID: this.client.config.guild })

        if (!statusData)
            return;

        if (statusData.Starboard === true) {
            if (reaction && reaction.emoji.name === '⭐' && reaction.count >= 1) {
                if (starboard) {
                    const poruka = await this.client.channels.cache.get(this.client.settings.starboard).messages.fetch({ message: starboard.EmbedID });

                    if (poruka) {
                        const Embed = new EmbedBuilder()
                            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                            .setColor("Yellow")
                            .setThumbnail(message.author.displayAvatarURL({ size: 2048, dynamic: true }))
                            .setImage(message.attachments.first()?.proxyURL || null)
                            .setDescription(`${this.client.emoji.statistic} **INFORMACIJE:**\n> ${this.client.emoji.human} **${message.author.tag}**\n> ${this.client.emoji.crown} Korisnikova poruka ima **${reaction.count}** reakcije/u.\n\n${this.client.emoji.diamond} **STARBOARD:**\n> ${this.client.emoji.key} Poruka: **${message.content || "Slika"}**\n> ${this.client.emoji.valid} Ukupan broj reakcija: **${reaction.count}**\n> ${this.client.emoji.bell} Link: [Kliknite da odete do poruke](${message.url})`)

                        await poruka.edit({ embeds: [Embed] });
                    }
                }
            } else if (reaction && reaction.emoji.name === '⭐' && reaction.count < 1) {
                if (starboard) {
                    const poruka = await this.client.channels.cache.get("1008865388655812638").messages.fetch({ message: starboard.EmbedID });

                    if (poruka) {
                        await poruka.delete();

                        await starboard.delete()
                    }
                }
            }
        }
    }
}