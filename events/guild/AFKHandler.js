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

        const data = await this.client.database.user.findOne({ Guild: message.guild.id, User: message.author.id });

        if (data) {
            if (data.AFKStatus === true) {
                message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                            .setColor("#9fa8ff")
                            .setTimestamp()
                            .setDescription(`${this.client.emoji.folder} **INFORMACIJE:**\n> ${this.client.emoji.human} **${message.author.tag}**\n> ${this.client.emoji.valid} Ugašen vam je afk status jer ste poslali poruku.\n\n${this.client.emoji.diamond} **AFK:**\n> ${this.client.emoji.frame} Razlog: **${data.AFKReason}**\n> ${this.client.emoji.clock} Upaljen: prije ${this.client.util.timeFormat(Date.now() - data.AFKStart)}`)
                    ]
                }).then(async (m) => {
                    await this.client.util.sleep(120000)
                    m.delete()
                });

                message.member.setNickname(`${data.AFKNickname}`)

                data.AFKStatus = false;
                data.AFKReason = "";
                data.AFKStart = 0;
                data.AFKNickname = "";

                await data.save();
            }
        }

        const user = message.mentions.users.first();

        if (user) {
            const userData = await this.client.database.user.findOne({ Guild: message.guild.id, User: user.id })

            if (userData) {
                if (userData.AFKStatus === true) {
                    return message.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                                .setColor("#9fa8ff")
                                .setTimestamp()
                                .setDescription(`${this.client.emoji.folder} **INFORMACIJE:**\n> ${this.client.emoji.human} **${user.tag}**\n> ${this.client.emoji.valid} Tagovali ste korisnika/cu, ali on/a je trenutno afk.\n\n${this.client.emoji.diamond} **AFK:**\n> ${this.client.emoji.frame} Razlog: **${userData.AFKReason}**\n> ${this.client.emoji.clock} Upaljen: prije ${this.client.util.timeFormat(Date.now() - userData.AFKStart)}`)
                        ]
                    }).then(async (m) => {
                        await this.client.util.sleep(60000)
                        m.delete()
                    });
                }
            }
        }
    }
}