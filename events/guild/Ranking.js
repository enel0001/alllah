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

        if (message.content.startsWith("."))
            return;

        const ecoData = await this.client.database.economy.findOne({ GuildID: message.guild.id, UserID: message.author.id });
        const data = await this.client.database.user.findOne({ Guild: message.guild.id, User: message.author.id });
        const champions = await this.client.database.champions.find({ Guild: message.guild.id, Status: true });

        if (message.channel.id === this.client.settings.dopisivanje) {
            if (!data) {
                await new this.client.database.user({
                    Guild: message.guild.id,
                    User: message.author.id,
                    Points: 0,
                    Messages: 1,
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
                    XP: 1,
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
                if (message.member.roles.cache.has(this.client.settings.roles.booster)) {
                    if (champions.length > 0) {
                        data.Points += this.client.util.randomNumber(1, 3);
                        data.XP += this.client.util.randomNumber(1, 3);
                        data.Messages += 1;

                        await data.save()
                    } else {
                        data.XP += this.client.util.randomNumber(1, 3);
                        data.Messages += 1;

                        await data.save()
                    }
                } else {
                    if (champions.length > 0) {
                        data.Points += 1;
                        data.Messages += 1;

                        if (ecoData && ecoData.XPBooster === true)
                            data.XP += 1 * ecoData.XPBoosterMultiplier;
                        else
                            data.XP += 1;

                        await data.save()
                    } else {
                        data.Messages += 1;

                        if (ecoData && ecoData.XPBooster === true)
                            data.XP += 1 * ecoData.XPBoosterMultiplier;
                        else
                            data.XP += 1;

                        await data.save()
                    }
                }

                if (data.XP >= data.Checkpoint) {
                    const level = data.Level + 1;
                    const checkpoint = 50 + (level * 5);

                    data.XP = 0;
                    data.Level += 1;
                    data.Checkpoint += checkpoint;

                    await data.save()

                    return message.channel.send({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                                .setTimestamp()
                                .setColor("#9fa8ff")
                                .setDescription(`${this.client.emoji.prize} **LEVEL UP:**\n> ${this.client.emoji.valid} **${message.author.tag}** je sa svojom aktivnošću dostigao/la novi level. (**${level}.**)`)
                        ]
                    })
                }
            }
        }
    }
}