const Base = require("../../base/util/client");
const EventInterface = require("../../base/templates/event");

module.exports = class ClientEvent extends EventInterface {
    /**
     * @param {Base} client 
     */
    constructor(client) {
        super()
        this.client = client;
        this.name = "presenceUpdate"
    };

    /**
     * @param {import('discord.js').Message} message ;
    */
    async execute(oldMember, newMember) {
        const data = await this.client.database.staff.findOne({ Guild: newMember.guild.id, User: newMember.user.id });

        if (!data)
            return;

        if (data.DutyStatus === true) {
            if (newMember.member.presence.status === "offline") {
                newMember.member.setNickname(``).catch(() => {
                    this.client.consoleLog(`Ne mogu postaviti nick korisniku ${newMember.user.tag}`, "Error")
                });

                data.DutyStatus = false;
                data.DutyTime += Date.now() - data.DutyStart;
                data.DutyToday += Date.now() - data.DutyStart;
                await data.save();
            }
        }
    }
}