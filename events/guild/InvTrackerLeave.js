const Base = require("../../base/util/client");
const EventInterface = require("../../base/templates/event");
const { EmbedBuilder } = require("discord.js");

module.exports = class ClientEvent extends EventInterface {
    /**
     * @param {Base} client 
     */
    constructor(client) {
        super()
        this.client = client;
        this.name = "guildMemberRemove"
    };
    async execute(member) {
        if (member.user.bot)
            return;

        const data = await this.client.database.user.findOne({ Guild: member.guild.id, User: member.user.id });

        const channel = this.client.channels.cache.get(this.client.settings.autopost.invites)

        if (data && data.InviterID) {
            if (data.InviterID === "VANITY") {
                data.InviterID = "";
                data.Code = "";

                await data.save();

                return channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("#ff3838")
                            .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
                            .setTimestamp()
                            .setDescription(`${this.client.emoji.statistic} **INFORMACIJE:**\n> ${this.client.emoji.human} **${member.user.tag}**\n> ${this.client.emoji.diamond} Korisnik/ca je izašao/la iz servera.\n\n${this.client.emoji.settings} **INVITE:**\n> ${this.client.emoji.hammer} Ušao/la je na server koristeći vanity url link.`)
                    ]
                })
            } else {
                const inviterData = await this.client.database.user.findOne({ Guild: member.guild.id, User: data.InviterID });

                inviterData.Invites -= 1;
                inviterData.InvitesLeft += 1;
                inviterData.InvitedTag.splice(inviterData.InvitedTag.indexOf(member.user.tag), 1);

                await inviterData.save();

                channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("#ff3838")
                            .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
                            .setTimestamp()
                            .setDescription(`${this.client.emoji.statistic} **INFORMACIJE:**\n> ${this.client.emoji.human} **${member.user.tag}**\n> ${this.client.emoji.diamond} Korisnik/ca je izašao/la iz servera.\n\n${this.client.emoji.settings} **INVITE:**\n> ${this.client.emoji.hammer} Pozvao/la na server ga/ju je **${this.client.users.cache.get(data.InviterID) ? this.client.users.cache.get(data.InviterID).tag : "Nepoznat korisnik/ca"}**`)
                    ]
                })

                data.InviterID = "";
                data.Code = "";

                await data.save();
            }
        } else {
            return channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#ff3838")
                        .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
                        .setTimestamp()
                        .setDescription(`${this.client.emoji.statistic} **INFORMACIJE:**\n> ${this.client.emoji.human} **${member.user.tag}**\n> ${this.client.emoji.diamond} Korisnik/ca je izašao/la iz servera.\n\n${this.client.emoji.settings} **INVITE:**\n> ${this.client.emoji.hammer} Ne mogu otkriti tko je pozvao/la korisnika/cu.`)
                ]
            })
        }
    }
}