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

        const statusData = await this.client.database.guild.findOne({ GuildID: this.client.config.guild })

        if (!statusData)
            return;

        if (statusData.ProfanityFilter === true) {
            const poruke = ["kurva", "pička", "govno", "sisa", "jebem", "jebač", "pizda", "jebo", "pičko", "siso", "kurvo"]

            for (let word of poruke) {
                if (message.content.includes(word)) {
                    if (message.member.permissions.has("ManageGuild"))
                        return;

                    setTimeout(function () { message.delete() }, 200)

                    const Embed = new EmbedBuilder()
                        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                        .setDescription(`${this.client.emoji.diamond} **PROFANITY FILTER:**\n> ${this.client.emoji.human} **${message.author.tag}**\n> ${this.client.emoji.diamond} Korisnik je pokušao poslati zabranjenu poruku (**${word}**).`)
                        .setColor("#9fa8ff")
                        .setTimestamp()

                    await message.guild.channels.cache.get(this.client.settings.autopost.automod).send({ embeds: [Embed] });
                }
            }
        }
    }
}