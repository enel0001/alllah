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
        this.name = "guildMemberAdd"
    };

    /**
     * @param {import('discord.js').Message} message ;
    */
    async execute(member) {
        if (member.user.bot)
            return;

        const statusData = await this.client.database.guild.findOne({ GuildID: this.client.config.guild })

        if (!statusData)
            return;

        if (statusData.AltDefender === true) {
            const channel = member.guild.channels.cache.get(this.client.settings.autopost.altdefender);
            const age = Math.abs(Date.now() - member.user.createdAt);
            const days = Math.ceil(age / 86400000);

            if (days <= 30) {
                member.ban({ reason: "Alt Defender" });

                const Embed = new EmbedBuilder()
                    .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
                    .setDescription(`${this.client.emoji.diamond} **ALT DEFENDER:**\n> ${this.client.emoji.human} **${member.user.tag}**\n> ${this.client.emoji.diamond} Korisnik je pokušao ući na server a njegov nalog je star **${days}** dana.`)
                    .setColor("#9fa8ff")
                    .setTimestamp()

                await channel.send({ embeds: [Embed] });
            }
        }
    }
}