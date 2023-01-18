const Base = require("../../base/util/client");
const CommandInterface = require("../../base/templates/command");
const { ChannelType, EmbedBuilder } = require("discord.js");

module.exports = class Moderation extends CommandInterface {
    /**
     * @param {Base} client 
     * @param {import('discord.js').Message} message 
     * @param {Array<string>} args 
     */
    constructor(client) {
        super();
        this.client = client;
        this.name = "nuke",
            this.category = "moderation",
            this.permission = "Administrator",
            this.description = "Obriše sve poruke u kanalu."
    };

    /**
     * @param {Base} client 
     * @param {import('discord.js').Message} message 
     * @param {Array<string>} args 
     */
    async execute(message, args) {
        const parent = message.channel.parent;
        const position = message.channel.position
        const permissions = message.channel.permissionOverwrites.cache
        const name = message.channel.name

        if (!parent)
            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.no} Kanal nema svoju kategoriju.`,
                "Error",
            )

        await message.channel.delete().then(async (c) => {
            message.guild.channels.create({
                name: name,
                type: ChannelType.GuildText,
                permissionOverwrites: permissions,
                parent: parent,
                position: position
            }).then(async (channel) => {
                await channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("#9fa8ff")
                            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                            .setTimestamp()
                            .setDescription(`${this.client.emoji.statistic} **INFORMACIJE:**\n> ${this.client.emoji.human} **${message.author.tag}**\n> ${this.client.emoji.diamond} Korisnik/ca je obrisao/la sve poruke u kanalu.`)
                    ]
                })
            }).catch(async (e) => {
                this.client.consoleLog(e, "Error")
            })
        }).catch(async (e) => {
            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.no} Ne mogu obrisati kanal.`,
            )
        })
    }
}