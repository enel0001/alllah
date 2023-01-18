const Base = require("../../base/util/client");
const EventInterface = require("../../base/templates/event");
const { EmbedBuilder } = require("discord.js");

module.exports = class GuildEvent extends EventInterface {
    /**
     * @param {Base} client 
     */
    constructor(client) {
        super()
        this.client = client;
        this.name = "messageCreate"
    };

    /**
     * @param {import('discord.js').Message} message ;
    */
    async execute(message) {
        if (message.channel.id === this.client.settings.suggestions) {
            if (message.author.bot)
                return;

            if (message.content.startsWith("."))
                return;

            await message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                        .setTimestamp()
                        .setColor("#9fa8ff")
                        .setDescription(`${this.client.emoji.statistic} **INFORMACIJE:**\n> ${this.client.emoji.human} **${message.author.tag}**\n> ${this.client.emoji.diamond} Korisnik/ca je poslao/la sugestiju za server.\n\n${this.client.emoji.key} **SUGESTIJA:**\n> ${this.client.emoji.valid} Poruka: **${message.content}**`)
                ]
            }).then(async (m) => {
                await message.delete();
                await m.react(this.client.emoji.yes);
                await m.react(this.client.emoji.no);
            })
        }
    }
}