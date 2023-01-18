const Base = require("../../base/util/client");
const CommandInterface = require("../../base/templates/command");
const { EmbedBuilder } = require("discord.js");

module.exports = class Moderation extends CommandInterface {
    /**
     * @param {Base} client 
     * @param {import('discord.js').Message} message 
     * @param {Array<string>} args 
     */
    constructor(client) {
        super();
        this.client = client;
        this.name = "unlock",
            this.category = "moderation",
            this.permission = "Administrator",
            this.aliases = ["unlockdown"],
            this.description = "Otključava kanal."
    };

    /**
     * @param {Base} client 
     * @param {import('discord.js').Message} message 
     * @param {Array<string>} args 
     */
    async execute(message, args) {
        const status = message.channel.permissionsFor(message.guild.id).has("SendMessages")

        if (status)
            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.no} Kanal nije zaključan.`,
                "Error"
            )

        await message.channel.permissionOverwrites.edit(message.guild.id, {
            SendMessages: true
        }).then(async (c) => {
            await message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#9fa8ff")
                        .setAuthor({ name: "Channel Lockdown Off", iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                        .setTimestamp()
                        .setDescription(`${this.client.emoji.statistic} **INFORMACIJE:**\n> ${this.client.emoji.human} **${message.author.tag}**\n> ${this.client.emoji.diamond} Korisnik/ca je otključao/la kanal.`)
                ]
            })
        }).catch((e) => {
            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.no} Došlo je do greške tokom otključavanja.`,
                "Error"
            )
        })
    }
}