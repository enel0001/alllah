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
        this.name = "lock",
            this.category = "moderation",
            this.permission = "Administrator",
            this.aliases = ["lockdown"],
            this.description = "Zaključava kanal."
    };

    /**
     * @param {Base} client 
     * @param {import('discord.js').Message} message 
     * @param {Array<string>} args 
     */
    async execute(message, args) {
        const reason = args.slice(0).join(" ");
        const status = message.channel.permissionsFor(message.guild.id).has("SendMessages")

        if (status === false)
            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.no} Kanal je već zaključan.`,
                "Error"
            )

        await message.channel.permissionOverwrites.edit(message.guild.id, {
            SendMessages: false
        }).then(async (c) => {
            if (!reason)
                await message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("#9fa8ff")
                            .setAuthor({ name: "Channel Lockdown", iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                            .setTimestamp()
                            .setDescription(`${this.client.emoji.statistic} **INFORMACIJE:**\n> ${this.client.emoji.human} **${message.author.tag}**\n> ${this.client.emoji.diamond} Korisnik/ca je zaključao/la kanal bez navedenog razloga.`)
                    ]
                })
            else if (reason)
                await message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("#9fa8ff")
                            .setAuthor({ name: "Channel Lockdown", iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                            .setTimestamp()
                            .setDescription(`${this.client.emoji.statistic} **INFORMACIJE:**\n> ${this.client.emoji.human} **${message.author.tag}**\n> ${this.client.emoji.diamond} Korisnik/ca je zaključao/la kanal sa navedenim razlogom.\n\n${this.client.emoji.settings} **LOCKDOWN:**\n> ${this.client.emoji.hammer} Razlog: **${reason}**`)
                    ]
                })
        }).catch((e) => {
            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.no} Došlo je do greške tokom zaključavanja.`,
                "Error"
            )
        })
    }
}