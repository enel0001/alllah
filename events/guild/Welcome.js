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

        if (statusData.WelcomeMessage === true) {
            const Welcome = new EmbedBuilder()
                .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
                .setDescription(`${this.client.emoji.diamond} **WELCOME:**\n> ${this.client.emoji.human} Korisnik **${member.user.tag}** se pridružio našem serveru.\n> ${this.client.emoji.folder} Uzmite svoje uloge u kanalu <#1035582665199464508>\n> ${this.client.emoji.frame} Pročitajte informacije o serveru u kanalu <#1035582653803548803>\n> ${this.client.emoji.picado} Nadamo se da ćete uživati tokom svog boravka na serveru.`)
                .setColor("#9fa8ff")
                .setTimestamp()

            await member.guild.channels.cache.get(this.client.settings.dopisivanje).send({ content: `${member}`, embeds: [Welcome] })
        }
    }
}