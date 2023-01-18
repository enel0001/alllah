const Base = require("../../base/util/client");
const EventInterface = require("../../base/templates/event");
const { EmbedBuilder, MessageType } = require("discord.js");

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
        if (message.author.bot)
            return;

        if (message.channel.type === "dm")
            return;

        if (message.guild === null)
            return;

        if (message.author === null)
            return;

        const statusData = await this.client.database.guild.findOne({ GuildID: this.client.config.guild })

        if (!statusData)
            return;

        if (statusData.BoostTracker === true) {
            if (message.type === MessageType.GuildBoost)
                message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                            .setDescription(`${this.client.emoji.diamond} **SERVER BOOST:**\n> ${this.client.emoji.human} **${message.author.tag}** je upravo boostao/la naš server.\n> ${this.client.emoji.diamond} Nadamo se da će vam se svidjeti privilegije.\n> ${this.client.emoji.gift} Server trenutno ima **${message.guild.premiumSubscriptionCount}** boostova.`)
                            .setColor("#f47fff")
                            .setTimestamp()
                    ]
                })
        }
    }
}