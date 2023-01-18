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

        const data = await this.client.database.economy.find({ GuildID: guild.id });

        if (!data)
            return;

        if (data.length > 0) {
            const filtered = await data.filter(d => d.EconomyBooster === true || d.XPBooster === true);

            filtered.forEach(async d => {
                if (d.EconomyBooster === true) {
                    setTimeout(async () => {
                        d.EconomyBooster = false;
                        d.EconomyBoosterEnd = "";
                        d.EconomyBoosterMultiplier = 1;

                        await d.save();
                    }, d.EconomyBoosterEnd - Date.now());
                }

                if (d.XPBooster === true) {
                    setTimeout(async () => {
                        d.XPBooster = false;
                        d.XPBoosterEnd = "";
                        d.XPBoosterMultiplier = 1;

                        await d.save();
                    }, d.XPBoosterEnd - Date.now());
                }
            })
        }
    }
}