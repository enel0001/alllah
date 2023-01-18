const Base = require("../../base/util/client");
const EventInterface = require("../../base/templates/event");
const { ChannelType } = require("discord.js");

module.exports = class ClientEvent extends EventInterface {
    /**
     * @param {Base} client 
     */
    constructor(client) {
        super()
        this.client = client;
        this.name = "voiceStateUpdate"
    };

    /**
     * @param {import('discord.js').Message} message ;
    */
    async execute(oldState, newState) {
        const { member, guild } = newState;
        const oldChannel = oldState.channel
        const newChannel = newState.channel

        if (oldChannel !== newChannel && newChannel && newChannel.id === this.client.settings.voicegen.channel) {
            await guild.channels.create({
                name: `🔊・${member.user.username}`,
                type: ChannelType.GuildVoice,
                parent: this.client.settings.voicegen.category,
                permissionOverwrites: [
                    {
                        id: member.id, allow: ["Connect", "Speak", "ManageChannels"]
                    },

                    {
                        id: guild.id, deny: ["Connect"]
                    }
                ]
            }).then(async (channel) => {
                this.client.voice.set(member.id, channel.id);

                return setTimeout(() => member.voice.setChannel(channel), 500);
            })
        }

        const ownedChannel = this.client.voice.get(member.id)

        if (ownedChannel && oldChannel && oldChannel.id == ownedChannel && (!newChannel || newChannel.id !== ownedChannel)) {
            this.client.voice.set(member.id, null)

            oldChannel.delete().catch(() => { });
        }
    }
}