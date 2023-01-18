const Base = require("../../base/util/client");
const EventInterface = require("../../base/templates/event");

module.exports = class GuildEvent extends EventInterface {
    /**
     * @param {Base} client 
     */
    constructor(client) {
        super()
        this.client = client;
        this.name = "inviteCreate"
    };
    async execute(invite) {
        this.client.util.cacheInvite(this.client, invite.guild);
    }
}