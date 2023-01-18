const Base = require("../../base/util/client");
const EventInterface = require("../../base/templates/event");
const { EmbedBuilder } = require('discord.js')

module.exports = class ClientEvent extends EventInterface {
    /**
     * @param {Base} client 
     */
    constructor(client) {
        super()
        this.client = client;
        this.name = "roleUpdate"
    };
    async execute(oldRole, newRole) {
        if (oldRole.name !== newRole.name)
            return this.client.channels.cache.get(this.client.settings.autopost.logs).send({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({ name: oldRole.name, iconURL: oldRole.guild.iconURL({ dynamic: true }) })
                        .setDescription(`${this.client.emoji.diamond} **ROLE UPDATE:**\n> ${this.client.emoji.locked} **${newRole.name}**\n> ${this.client.emoji.key} Role **${oldRole.name}** ime je promijenjeno u **${newRole.name}**.`)
                        .setColor("#9fa8ff")
                        .setTimestamp()
                ]
            })
        else if (oldRole.color !== newRole.color)
            return this.client.channels.cache.get(this.client.settings.autopost.logs).send({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({ name: oldRole.name, iconURL: oldRole.guild.iconURL({ dynamic: true }) })
                        .setDescription(`${this.client.emoji.diamond} **ROLE UPDATE:**\n> ${this.client.emoji.locked} **${newRole.name}**\n> ${this.client.emoji.key} Role boja je promijenjena iz **${oldRole.hexColor}** u **${newRole.hexColor}**.`)
                        .setColor("#9fa8ff")
                        .setTimestamp()
                ]
            })
    }
}