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

        if (statusData.Links === true) {
            const discinvite = /(https?:\/\/)?(www.)?(discord.(gg|io|me|li|link|plus)|discorda?p?p?.com\/invite|invite.gg|dsc.gg|urlcord.cf)\/[^\s/]+?(?=\b)/;

            if (discinvite.test(message.content)) {
                if (message.member.permissions.has("ManageGuild"))
                    return;

                setTimeout(function () { message.delete() }, 200)

                const Embed = new EmbedBuilder()
                    .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                    .setDescription(`${this.client.emoji.diamond} **ANTI LINK:**\n> ${this.client.emoji.human} **${message.author.tag}**\n> ${this.client.emoji.diamond} Korisnik je pokušao poslati link.`)
                    .setColor("#9fa8ff")
                    .setTimestamp()

                await message.guild.channels.cache.get(this.client.settings.autopost.automod).send({ embeds: [Embed] });
            }
        }
    }
}