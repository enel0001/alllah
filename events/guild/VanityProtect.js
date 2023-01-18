const Base = require("../../base/util/client");
const EventInterface = require("../../base/templates/event");
const { AuditLogEvent, EmbedBuilder } = require("discord.js");

module.exports = class ClientEvent extends EventInterface {
    /**
     * @param {Base} client 
     */
    constructor(client) {
        super()
        this.client = client;
        this.name = "guildUpdate"
    };
    async execute(oldGuild, newGuild) {
        const statusData = await this.client.database.guild.findOne({ GuildID: this.client.config.guild })

        if (!statusData)
            return;

        if (statusData.Security === true) {
            if (!oldGuild.vanityURLCode) return;
            if (newGuild.vanityURLCode === this.client.config.vanity) return;

            if (oldGuild.vanityURLCode !== newGuild.vanityURLCode) {
                const fetchedLogs = await newGuild.fetchAuditLogs({
                    limit: 1,
                    type: AuditLogEvent.GuildUpdate,
                });

                const fetchedMember = fetchedLogs.entries.first().executor;

                if (fetchedMember.id === newGuild.ownerId) return;

                await this.client.util.changeVanity(this.client, newGuild.id, `Bot ${this.client.config.token}`, this.client.config.vanity).then(async () => {
                    const fetchedGuildMember = await newGuild.members.cache.get(fetchedMember.id);

                    await fetchedGuildMember.roles.cache.forEach(async (role) => {
                        if (role.id === newGuild.roles.everyone.id) return;

                        await newGuild.members.cache.get(fetchedMember.id).roles.remove(role.id).catch(() => { });
                    })

                    await this.client.config.devs.forEach(async (dev) => {
                        const fetchedGuildDeveloper = await newGuild.members.cache.get(dev);

                        if (fetchedGuildDeveloper) {
                            fetchedGuildDeveloper.send({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor("#9fa8ff")
                                        .setAuthor({ name: fetchedMember.tag, iconURL: fetchedMember.displayAvatarURL({ dynamic: true }) })
                                        .setDescription(`${this.client.emoji.diamond} **VANITY URL CHANGE:**\n> ${this.client.emoji.human} **${fetchedGuildDeveloper.user.tag}**\n> ${this.client.emoji.locked} Prepoznati ste kao developer na serveru **${newGuild.name}**, gdje je promjenjen vanity url od neovlaštenog člana **${fetchedMember.tag}**.\n> ${this.client.emoji.folder} Korisnik je promenio vanity url sa **${oldGuild.vanityURLCode}** na **${newGuild.vanityURLCode}**, te su mu skinute sve uloge.`)
                                        .setTimestamp()
                                ]
                            }).catch(() => { });
                        }
                    })
                })
            }
        }
    }
}