const Base = require("../../base/util/client");
const EventInterface = require("../../base/templates/event");
const { EmbedBuilder } = require('discord.js')

module.exports = class GuildEvent extends EventInterface {
    /**
     * @param {Base} client 
     */
    constructor(client) {
        super()
        this.client = client;
        this.name = "channelDelete"
    };
    async execute(channel) {
        return this.client.channels.cache.get(this.client.settings.autopost.logs).send({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: channel.name, iconURL: channel.guild.iconURL({ dynamic: true }) })
                    .setDescription(`${this.client.emoji.diamond} **CHANNEL DELETE:**\n> ${this.client.emoji.locked} **${channel.name}**\n> ${this.client.emoji.key} Kanal **${channel.name}** je izbrisan.`)
                    .setColor("#9fa8ff")
                    .setTimestamp()
            ]
        })
    }
}