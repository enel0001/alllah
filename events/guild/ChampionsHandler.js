const Base = require("../../base/util/client");
const EventInterface = require("../../base/templates/event");
const { EmbedBuilder } = require("discord.js")

module.exports = class ClientEvent extends EventInterface {
    /**
     * @param {Base} client 
     */
    constructor(client) {
        super()
        this.client = client;
        this.name = "ready",
            this.once = true
    };

    /**
     * @param {import('discord.js').Message} message ;
    */
    async execute() {
        const guild = this.client.guilds.cache.get(this.client.config.guild);

        const champions = await this.client.database.champions.find({ Guild: guild.id })

        if (!champions)
            return;

        if (champions.length > 0) {
            champions.filter(g => g.Status === true).forEach(async (champion) => {
                if (!champion)
                    return;

                const interval = setInterval(async () => {
                    const channel = guild.channels.cache.get(champion.Channel)

                    if (!channel) {
                        await this.client.database.champions.deleteOne({ Guild: guild.id, ID: champion.ID })

                        return clearInterval(interval)
                    }

                    const msg = await channel.messages.fetch(champion.Message)

                    if (!msg) {
                        await this.client.database.champions.deleteOne({ Guild: guild.id, ID: champion.ID })

                        return clearInterval(interval)
                    }

                    let leaderboardData = await this.client.database.user.find({ Guild: msg.guild.id })
                    let members = [];

                    for (let obj of leaderboardData)
                        if (msg.guild.members.cache.map((member) => member.id).includes(obj.User))
                            members.push(obj)

                    members = members.sort((a, b) => b.Points - a.Points);
                    members = members.filter(function Dovoljno(value) { return value.Points > 0 })
                    members = members.slice(0, 10)

                    let desc = ""

                    const emojis = [`${this.client.emoji.first}`, `${this.client.emoji.second}`, `${this.client.emoji.third}`, "4.", "5.", "6.", "7.", "8.", "9.", "10."]

                    for (let i = 0; i < members.length; i++) {
                        let user = this.client.users.cache.get(members[i].User)

                        if (!user)
                            return;

                        let total = members[i].Points

                        desc += `> ${emojis[i]} **${user.tag}** — **${this.client.util.cleanNumber(total)}** point/a\n`
                    }

                    if (champion.Time < Date.now()) {
                        const winner = members[0]

                        if (!winner) {
                            await this.client.database.champions.deleteOne({ Guild: msg.guild.id, ID: champion.ID })

                            return clearInterval(interval)
                        }

                        const user = this.client.users.cache.get(winner.User) ? this.client.users.cache.get(winner.User).tag : "Nepoznat korisnik/ca"

                        const Embed = new EmbedBuilder()
                            .setColor("#9fa8ff")
                            .setTimestamp()
                            .setAuthor({ name: `Champions`, iconURL: this.client.user.displayAvatarURL() })
                            .setDescription(`${this.client.emoji.statistic} **INFORMACIJE:**\n> ${this.client.emoji.key} Na serveru je završen **champions** event.\n> ${this.client.emoji.diamond} Dobijate **1** point po poslanoj poruci u dopisivanje kanalu.\n\n${this.client.emoji.gift} **CHAMPIONS #${champion.ID}:**\n> ${this.client.emoji.prize} Nagrada: **${champion.Prize}**\n> ${this.client.emoji.crown} Pobjednik: **${user}**\n\n${this.client.emoji.folder} **LEADERBOARD:**\n${desc || "> Nijedan korisnik nema pointove."}`)

                        clearInterval(interval);

                        champion.Winner = winner.User
                        champion.Status = false

                        await champion.save()

                        return await msg.edit({ embeds: [Embed], components: [] })
                    } else {
                        const Embed = new EmbedBuilder()
                            .setColor("#9fa8ff")
                            .setTimestamp()
                            .setFooter({ text: "Poslednje ažuriranje" })
                            .setAuthor({ name: `Champions`, iconURL: this.client.user.displayAvatarURL() })
                            .setDescription(`${this.client.emoji.statistic} **INFORMACIJE:**\n> ${this.client.emoji.key} Na serveru je pokrenut novi **champions** event.\n> ${this.client.emoji.diamond} Dobijate **1** point po poslanoj poruci u dopisivanje kanalu.\n\n${this.client.emoji.gift} **CHAMPIONS #${champion.ID}:**\n> ${this.client.emoji.prize} Nagrada: **${champion.Prize}**\n> ${this.client.emoji.clock} Završava za: ${this.client.util.timeFormat(champion.Time - Date.now())}\n> ${this.client.emoji.crown} Pobjednik: **Event u toku**\n\n${this.client.emoji.folder} **LEADERBOARD:**\n${desc || "> Nijedan korisnik nema pointove."}`)

                        await msg.edit({ embeds: [Embed] })
                    }
                }, 10000);
            })
        }
    }
}