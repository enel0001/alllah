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
        this.name = "messageDelete"
    };

    /**
     * @param {import('discord.js').Message} message ;
    */
    async execute(message) {
        if (message.author.bot)
            return;

        return this.client.channels.cache.get(this.client.settings.autopost.logs).send({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                    .setDescription(`${this.client.emoji.diamond} **MESSAGE DELETE:**\n> ${this.client.emoji.human} **${message.author.tag}**\n> ${this.client.emoji.key} Poruka u kanalu **<#${message.channel.id}>** je obrisana.\n\n${this.client.emoji.minus} **PORUKA:**\n\`\`\`${message.content || "Nema poruke."}\`\`\``)
                    .setColor("#9fa8ff")
                    .setImage(message.attachments.first()?.proxyURL || null)
                    .setTimestamp()
            ]
        })
    }
}