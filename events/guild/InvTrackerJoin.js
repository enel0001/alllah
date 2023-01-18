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
        this.name = "guildMemberAdd"
    };

    /**
     * @param {import('discord.js').Message} message ;
    */
    async execute(member) {
        if (member.user.bot)
            return;

        const cached = this.client.invites.get(member.guild.id);
        const newCached = await this.client.util.cacheInvite(this.client, member.guild);

        if (!cached)
            return;

        const invite = newCached.find((inv) => cached.get(inv.code) && cached.get(inv.code).uses < inv.uses);

        const channel = member.guild.channels.cache.get(this.client.settings.autopost.invites);

        if (!channel)
            return;

        if (invite) {
            if (invite.code === member.guild.vanityURLCode) {
                const memberData = await this.client.database.user.findOne({ Guild: member.guild.id, User: member.user.id });

                if (!memberData) {
                    await new this.client.database.user({
                        Guild: member.guild.id,
                        User: member.user.id,
                        Points: 0,
                        Messages: 0,
                        AFKStatus: false,
                        AFKReason: "",
                        AFKNickname: "",
                        AFKStart: "",
                        VoiceStart: 0,
                        VoiceTime: 0,
                        InviterID: "VANITY",
                        Code: invite.code,
                        Invites: 0,
                        InvitesJoins: 0,
                        InvitesLeft: 0,
                        InvitesRejoins: 0,
                        InvitedList: [],
                        InvitedTag: [],
                        Level: 0,
                        XP: 0,
                        Checkpoint: 100,
                        MarriagePartner: "",
                        MarriageStatus: false,
                        MarriedList: [],
                        MarriedTag: [],
                        Reputations: 0,
                        LastReputation: "",
                        ReputationCD: "",
                    }).save();
                }

                return channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("#9fa8ff")
                            .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
                            .setTimestamp()
                            .setDescription(`${this.client.emoji.statistic} **INFORMACIJE:**\n> ${this.client.emoji.human} **${member.user.tag}**\n> ${this.client.emoji.valid} Korisnik/ca se pridružio/la našem serveru.\n\n${this.client.emoji.diamond} **INVITE:**\n> ${this.client.emoji.hotel} Na server je ušao/la koristeći vanity url code.\n> ${this.client.emoji.clock} Nalog je napravio/la prije ${this.client.util.timeFormat(Date.now() - member.user.createdTimestamp)}`)
                    ]
                })
            } else if (invite.inviterId === member.user.id) {
                const memberData = await this.client.database.user.findOne({ Guild: member.guild.id, User: member.user.id });

                if (!memberData) {
                    await new this.client.database.user({
                        Guild: member.guild.id,
                        User: member.user.id,
                        Points: 0,
                        Messages: 0,
                        AFKStatus: false,
                        AFKReason: "",
                        AFKNickname: "",
                        AFKStart: "",
                        VoiceStart: 0,
                        VoiceTime: 0,
                        InviterID: "",
                        Code: "",
                        Invites: 0,
                        InvitesJoins: 0,
                        InvitesLeft: 0,
                        InvitesRejoins: 0,
                        InvitedList: [],
                        InvitedTag: [],
                        Level: 0,
                        XP: 0,
                        Checkpoint: 100,
                        MarriagePartner: "",
                        MarriageStatus: false,
                        MarriedList: [],
                        MarriedTag: [],
                        Reputations: 0,
                        LastReputation: "",
                        ReputationCD: "",
                    }).save();
                }
            } else {
                const memberData = await this.client.database.user.findOne({ Guild: member.guild.id, User: member.user.id });
                const inviterData = await this.client.database.user.findOne({ Guild: member.guild.id, User: invite.inviterId });

                if (!inviterData) {
                    await new this.client.database.user({
                        Guild: member.guild.id,
                        User: invite.inviterId,
                        Points: 0,
                        Messages: 0,
                        AFKStatus: false,
                        AFKReason: "",
                        AFKNickname: "",
                        AFKStart: "",
                        VoiceStart: 0,
                        VoiceTime: 0,
                        InviterID: "",
                        Code: "",
                        Invites: 1,
                        InvitesJoins: 1,
                        InvitesLeft: 0,
                        InvitesRejoins: 0,
                        InvitedList: [member.user.id],
                        InvitedTag: [member.user.tag],
                        Level: 0,
                        XP: 0,
                        Checkpoint: 100,
                        MarriagePartner: "",
                        MarriageStatus: false,
                        MarriedList: [],
                        MarriedTag: [],
                        Reputations: 0,
                        LastReputation: "",
                        ReputationCD: "",
                    }).save();
                } else {
                    const invitedList = inviterData && inviterData.InvitedList ? inviterData.InvitedList : [];

                    if (invitedList.includes(member.user.id)) {
                        inviterData.InvitesJoins += 1;
                        inviterData.InvitesRejoins += 1;

                        await inviterData.save()
                    } else {
                        inviterData.Invites += 1;
                        inviterData.InvitesJoins += 1;
                        inviterData.InvitedList.push(member.user.id);
                        inviterData.InvitedTag.push(member.user.tag);

                        await inviterData.save()
                    }
                }

                if (!memberData) {
                    await new this.client.database.user({
                        Guild: member.guild.id,
                        User: member.user.id,
                        Points: 0,
                        Messages: 0,
                        AFKStatus: false,
                        AFKReason: "",
                        AFKNickname: "",
                        AFKStart: "",
                        VoiceStart: 0,
                        VoiceTime: 0,
                        InviterID: invite.inviterId,
                        Code: invite.code,
                        Invites: 0,
                        InvitesJoins: 0,
                        InvitesLeft: 0,
                        InvitesRejoins: 0,
                        InvitedList: [],
                        InvitedTag: [],
                        Level: 0,
                        XP: 0,
                        Checkpoint: 100,
                        MarriagePartner: "",
                        MarriageStatus: false,
                        MarriedList: [],
                        MarriedTag: [],
                        Reputations: 0,
                        LastReputation: "",
                        ReputationCD: "",
                    }).save();
                } else {
                    const invitedList = inviterData && inviterData.InvitedList ? inviterData.InvitedList : [];

                    if (invitedList.includes(member.user.id)) {
                        memberData.InviterID = "";
                        memberData.Code = "";

                        await memberData.save()
                    } else {
                        memberData.InviterID = invite.inviterId;
                        memberData.Code = invite.code;

                        await memberData.save()
                    }
                }

                return channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("#9fa8ff")
                            .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
                            .setTimestamp()
                            .setDescription(`${this.client.emoji.statistic} **INFORMACIJE:**\n> ${this.client.emoji.human} **${member.user.tag}**\n> ${this.client.emoji.valid} Korisnik/ca se pridružio/la našem serveru.\n\n${this.client.emoji.diamond} **INVITE:**\n> ${this.client.emoji.hotel} Pozvan je od strane korisnika/ce **${this.client.users.cache.get(invite.inviterId) ? this.client.users.cache.get(invite.inviterId).tag : "Nepoznat korisnik/ca"}**\n> ${this.client.emoji.clock} Nalog je napravio/la prije ${this.client.util.timeFormat(Date.now() - member.user.createdTimestamp)}`)
                    ]
                })
            }
        } else {
            const memberData = await this.client.database.user.findOne({ Guild: member.guild.id, User: member.user.id });

            if (!memberData) {
                await new this.client.database.user({
                    Guild: member.guild.id,
                    User: member.user.id,
                    Points: 0,
                    Messages: 0,
                    AFKStatus: false,
                    AFKReason: "",
                    AFKNickname: "",
                    AFKStart: "",
                    VoiceStart: 0,
                    VoiceTime: 0,
                    InviterID: "",
                    Code: "",
                    Invites: 0,
                    InvitesJoins: 0,
                    InvitesLeft: 0,
                    InvitesRejoins: 0,
                    InvitedList: [],
                    InvitedTag: [],
                    Level: 0,
                    XP: 0,
                    Checkpoint: 100,
                    MarriagePartner: "",
                    MarriageStatus: false,
                    MarriedList: [],
                    MarriedTag: [],
                    Reputations: 0,
                    LastReputation: "",
                    ReputationCD: "",
                }).save();
            } else {
                memberData.InviterID = "";
                memberData.Code = "";

                await memberData.save()
            }

            return channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#9fa8ff")
                        .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
                        .setTimestamp()
                        .setDescription(`${this.client.emoji.statistic} **INFORMACIJE:**\n> ${this.client.emoji.human} **${member.user.tag}**\n> ${this.client.emoji.valid} Korisnik/ca se pridružio/la našem serveru.\n\n${this.client.emoji.diamond} **INVITE:**\n> ${this.client.emoji.hotel} Ne mogu otkriti ko ga/ju je pozvao/la na server.\n> ${this.client.emoji.clock} Nalog je napravio/la prije ${this.client.util.timeFormat(Date.now() - member.user.createdTimestamp)}`)
                ]
            })
        }
    }
}