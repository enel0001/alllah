const Base = require("../../base/util/client");
const EventInterface = require("../../base/templates/event");

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

        if (statusData.AutoRole === true) {
            this.client.settings.autoroles.forEach(async (r) => {
                member.roles.add(r);
            })
        }
    }
}