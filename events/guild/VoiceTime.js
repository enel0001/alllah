const Base = require("../../base/util/client");
const EventInterface = require("../../base/templates/event");

module.exports = class ClientEvent extends EventInterface {
    /**
     * @param {Base} client 
     */
    constructor(client) {
        super()
        this.client = client;
        this.name = "voiceStateUpdate"
    };
    async execute(oldState, newState) {
        if (newState.member.user.bot)
            return;

        const data = await this.client.database.user.findOne({ Guild: newState.guild.id, User: newState.id });

        if (!data) {
            if (oldState.channel == null && newState.channel != null) {
                await new this.client.database.user({
                    Guild: newState.guild.id,
                    User: newState.id,
                    Points: 0,
                    Messages: 0,
                    AFKStatus: false,
                    AFKReason: "",
                    AFKNickname: "",
                    AFKStart: "",
                    VoiceStart: Date.now(),
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
            if (oldState.channel == null && newState.channel != null) {
                if (data.VoiceTime == 0) {
                    data.VoiceStart = Date.now();

                    await data.save();
                } else {
                    data.VoiceStart = Date.now();

                    await data.save();
                }
            }

            if (oldState.channel != null && newState.channel == null) {
                if (data.VoiceStart == 0)
                    return;

                const time = Date.now() - data.VoiceStart;

                data.VoiceTime += time;

                await data.save();
            }
        }
    }
}