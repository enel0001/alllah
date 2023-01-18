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
        this.name = "messageUpdate"
    };

    /**
     * @param {import('discord.js').Message} message ;
    */
    async execute(oldMessage, newMessage) {
        if (oldMessage.author.bot)
            return;

        if (oldMessage.content == newMessage.content)
            return;

        return this.client.channels.cache.get(this.client.settings.autopost.logs).send({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: oldMessage.author.tag, iconURL: oldMessage.author.displayAvatarURL({ dynamic: true }) })
                    .setDescription(`${this.client.emoji.diamond} **MESSAGE UPDATE:**\n> ${this.client.emoji.human} **${newMessage.author.tag}**\n> ${this.client.emoji.key} Poruka u kanalu **<#${oldMessage.channel.id}>** je promijenjena.\n\n${this.client.emoji.minus} **STARA PORUKA:**\n\`\`\`${oldMessage.content || "Nema poruke."}\`\`\`\n${this.client.emoji.plus} **NOVA PORUKA:**\n\`\`\`${newMessage.content || "Nema poruke."}\`\`\``)
                    .setColor("#9fa8ff")
                    .setImage(newMessage.attachments.first()?.proxyURL || oldMessage.attachments.first()?.proxyURL || null)
                    .setTimestamp()
            ]
        })
    }
}