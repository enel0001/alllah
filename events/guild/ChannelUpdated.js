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
        this.name = "channelUpdate"
    };
    async execute(oldChannel, newChannel) {
        if (oldChannel.name !== newChannel.name)
            return this.client.channels.cache.get(this.client.settings.autopost.logs).send({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({ name: oldChannel.name, iconURL: oldChannel.guild.iconURL({ dynamic: true }) })
                        .setDescription(`${this.client.emoji.diamond} **CHANNEL UPDATE:**\n> ${this.client.emoji.human} **${oldChannel.name}**\n> ${this.client.emoji.key} Ime kanala je promijenjeno iz **${oldChannel.name}** u **${newChannel.name}**.`)
                        .setColor("#9fa8ff")
                        .setTimestamp()
                ]
            })
        else if (oldChannel.parentId !== newChannel.parentId)
            return this.client.channels.cache.get(this.client.settings.autopost.logs).send({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({ name: oldChannel.name, iconURL: oldChannel.guild.iconURL({ dynamic: true }) })
                        .setDescription(`${this.client.emoji.diamond} **CHANNEL UPDATE:**\n> ${this.client.emoji.human} **${oldChannel.name}**\n> ${this.client.emoji.key} Kategorija kanala je promijenjena iz **${oldChannel.parentId ? `<#${oldChannel.parentId}>` : "Nepoznato"}** u **${newChannel.parentId ? `<#${newChannel.parentId}>` : "Nepoznato"}**`)
                        .setColor("#9fa8ff")
                        .setTimestamp()
                ]
            })
    }
}