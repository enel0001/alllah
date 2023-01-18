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
        this.name = "roleDelete"
    };
    async execute(role) {
        return this.client.channels.cache.get(this.client.settings.autopost.logs).send({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: role.name, iconURL: role.guild.iconURL({ dynamic: true }) })
                    .setDescription(`${this.client.emoji.diamond} **ROLE DELETE:**\n> ${this.client.emoji.locked} **${role.name}**\n> ${this.client.emoji.key} Role **${role.name}** je izbrisan.`)
                    .setColor("#9fa8ff")
                    .setTimestamp()
            ]
        })
    }
}