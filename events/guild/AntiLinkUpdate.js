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
        if (newMessage.author.bot)
            return;

        const statusData = await this.client.database.guild.findOne({ GuildID: this.client.config.guild })

        if (!statusData)
            return;

        if (statusData.Links === true) {
            const discinvite = /(https?:\/\/)?(www.)?(discord.(gg|io|me|li|link|plus)|discorda?p?p?.com\/invite|invite.gg|dsc.gg|urlcord.cf)\/[^\s/]+?(?=\b)/;

            if (discinvite.test(newMessage.content)) {
                if (newMessage.member.permissions.has("ManageGuild"))
                    return;

                setTimeout(function () { newMessage.delete() }, 200)

                const Embed = new EmbedBuilder()
                    .setAuthor({ name: newMessage.author.tag, iconURL: newMessage.author.displayAvatarURL({ dynamic: true }) })
                    .setDescription(`${this.client.emoji.diamond} **ANTI LINK:**\n> ${this.client.emoji.human} **${newMessage.author.tag}**\n> ${this.client.emoji.diamond} Korisnik je pokušao poslati link na editovanoj poruci.`)
                    .setColor("#9fa8ff")
                    .setTimestamp()

                await newMessage.guild.channels.cache.get(this.client.settings.autopost.automod).send({ embeds: [Embed] });
            }
        }
    }
}