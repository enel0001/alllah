const Base = require("../../base/util/client");
const EventInterface = require("../../base/templates/event");

module.exports = class ClientEvent extends EventInterface {
    /**
     * @param {Base} client 
     */
    constructor(client) {
        super()
        this.client = client;
        this.name = "ready"
    };

    /**
     * @param {import('discord.js').Message} message ;
    */
    async execute() {
        const guild = this.client.guilds.cache.get(this.client.config.guild);

        const bans = await this.client.database.moderation.find({ Guild: guild.id });

        if (!bans)
            return;

        if (bans.length > 0) {
            bans.filter(b => b.Action === "Temp Ban").forEach(async ban => {
                setTimeout(() => {
                    guild.bans.fetch(ban.User).then((b) => {
                        guild.members.unban(ban.User)
                        ban.remove();
                    }).catch((s) => {
                        return this.client.consoleLog(`Ne mogu unbanovati korisnika/cu.`, "Error")
                    })
                }, ban.EndingDate - Date.now());
            });
        }
    }
}