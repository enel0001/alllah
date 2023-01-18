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
        this.name = "messageCreate"
    };

    /**
     * @param {import('discord.js').Message} message ;
    */
    async execute(message) {
        if (message.author.bot)
            return;

        if (message.content.length < 10)
            return;

        if (message.member.permissions.has("ManageGuild"))
            return;

        const statusData = await this.client.database.guild.findOne({ GuildID: this.client.config.guild })

        if (!statusData)
            return;

        if (statusData.AntiCaps === true) {
            const words = ["<", "@", "&", "#", ">"]

            for (let word in words)
                if (message.content.includes(word))
                    return;

            let caps = 0;

            for (let x = 0; x < message.content.length; x++)
                if (message.content[x].toUpperCase() === message.content[x])
                    caps++;

            const textCaps = ((caps / message.content.length) * 100).toFixed();

            if (textCaps >= 60) {
                setTimeout(function () { message.delete() }, 200)

                const Embed = new EmbedBuilder()
                    .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                    .setDescription(`${this.client.emoji.diamond} **ANTI CAPS:**\n> ${this.client.emoji.human} **${message.author.tag}**\n> ${this.client.emoji.diamond} Korisnik je pokušao poslati poruku koja sadrži **${textCaps}%** capslocka.`)
                    .setColor("#9fa8ff")
                    .setTimestamp()

                await message.guild.channels.cache.get(this.client.settings.autopost.automod).send({ embeds: [Embed] });
            }
        }
    }
}