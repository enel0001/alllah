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

        if (message.member.permissions.has("ManageGuild"))
            return;

        if (message.channel.id === this.client.settings.dopisivanje) {
            if (message.member.roles.cache.has(this.client.settings.roles.staff)) {
                const data = await this.client.database.staff.findOne({ Guild: message.guild.id, User: message.author.id })

                if (!data) {
                    await new this.client.database.staff({
                        Guild: message.guild.id,
                        User: message.author.id,
                        Plus: 0,
                        Minus: 0,
                        History: [],
                        DutyStatus: false,
                        DutyStart: 0,
                        DutyTime: 0,
                        DutyToday: 0,
                        Activity: 1,
                    }).save();
                } else {
                    data.Activity += 1;

                    await data.save();

                    if (data.Activity == 150)
                        await message.guild.channels.cache.get(this.client.settings.staffaktivnost).send({
                            embeds: [
                                new EmbedBuilder()
                                    .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                                    .setTimestamp()
                                    .setColor("#9fa8ff")
                                    .setDescription(`${this.client.emoji.statistic} **AKTIVNOST:**\n> ${this.client.emoji.human} **${message.author.tag}**\n> ${this.client.emoji.diamond} Korisnik je dobio **plus** prije <t:${Math.floor(Date.now() / 1000)}:R> zbog aktivnosti u chatu.`)
                            ]
                        }).then(async msg => {
                            data.Plus += 1;
                            data.Activity = 0;
                            data.History.push(`> **[+]** Dobijen plus zbog aktivnosti u chatu.`);

                            await data.save();
                        })
                }
            }
        }
    }
}