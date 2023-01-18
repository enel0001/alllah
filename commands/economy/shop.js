const Base = require("../../base/util/client");
const CommandInterface = require("../../base/templates/command");
const { EmbedBuilder } = require("discord.js")

module.exports = class Economy extends CommandInterface {
    /**
     * @param {Base} client 
     * @param {import('discord.js').Message} message 
     * @param {Array<string>} args 
     */
    constructor(client) {
        super();
        this.client = client;
        this.name = "shop",
            this.category = "economy",
            this.description = "Prikazuje prodavnicu servera."
    };
    /**
     * @param {Base} client 
     * @param {import('discord.js').Message} message 
     * @param {Array<string>} args 
     */
    async execute(message, args) {
        const Embeds = [];

        Embeds.push(
            new EmbedBuilder()
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                .setColor("#9fa8ff")
                .setTimestamp()
                .setDescription(`${this.client.emoji.statistic} **INFORMACIJE:**\n> ${this.client.emoji.human} **${message.author.tag}**\n> ${this.client.emoji.diamond} Da kupite odredjenu stvar iz prodavnice, koristite **.buy <slot>**.\n> ${this.client.emoji.clock} Svaki booster traje **24 sata**, svaka druga stvar iz prodavnice ostaje zauvek.\n\n${this.client.emoji.diamond} **XP BOOSTERI:**\n> ${this.client.emoji.enabled} XP Booster x2 — ${this.client.emoji.bank} **100,000$** (**#01**)\n> ${this.client.emoji.enabled} XP Booster x3 — ${this.client.emoji.bank} **200,000$** (**#02**)\n> ${this.client.emoji.enabled} XP Booster x4 — ${this.client.emoji.bank} **300,000$** (**#03**)\n\n${this.client.emoji.bank} **ECONOMY BOOSTERI:**\n> ${this.client.emoji.enabled} Income Booster x2 — ${this.client.emoji.bank} **150,000$** (**#04**)\n> ${this.client.emoji.enabled} Income Booster x3 — ${this.client.emoji.bank} **300,000$** (**#05**)\n> ${this.client.emoji.enabled} Income Booster x4 — ${this.client.emoji.bank} **500,000$** (**#06**)`),
            new EmbedBuilder()
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                .setColor("#9fa8ff")
                .setTimestamp()
                .setDescription(`${this.client.emoji.statistic} **INFORMACIJE:**\n> ${this.client.emoji.human} **${message.author.tag}**\n> ${this.client.emoji.diamond} Da kupite odredjenu stvar iz prodavnice, koristite **.buy <slot>**.\n\n${this.client.emoji.prize} **COLLECT ROLOVI:**\n> ${this.client.emoji.enabled} Starter [**2,000$**, **30min**] — ${this.client.emoji.bank} **100,000$** (**#07**)\n> ${this.client.emoji.enabled} Hero [**4,000$**, **45min**] — ${this.client.emoji.bank} **200,000$** (**#08**)\n> ${this.client.emoji.enabled} Legend [**6,000$**, **1h**] — ${this.client.emoji.bank} **300,000$** (**#09**)\n> ${this.client.emoji.enabled} Diamond [**8,000$**, **1.5h**] — ${this.client.emoji.bank} **400,000$** (**#10**)\n> ${this.client.emoji.enabled} Emerald [**10,000$**, **2h**] — ${this.client.emoji.bank} **500,000$** (**#11**)\n> ${this.client.emoji.enabled} Ruby [**12,000$**, **2.5h**] — ${this.client.emoji.bank} **600,000$** (**#12**)\n> ${this.client.emoji.enabled} Spartan [**14,000$**, **3h**] — ${this.client.emoji.bank} **700,000$** (**#13**)\n> ${this.client.emoji.enabled} Immortal [**16,000$**, **3.5h**] — ${this.client.emoji.bank} **800,000$** (**#14**)\n> ${this.client.emoji.enabled} Indigo [**18,000$**, **4h**] — ${this.client.emoji.bank} **900,000$** (**#15**)\n> ${this.client.emoji.enabled} God [**20,000$**, **5h**] — ${this.client.emoji.bank} **1,000,000$** (**#16**)`),
            new EmbedBuilder()
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                .setColor("#9fa8ff")
                .setTimestamp()
                .setDescription(`${this.client.emoji.statistic} **INFORMACIJE:**\n> ${this.client.emoji.human} **${message.author.tag}**\n> ${this.client.emoji.diamond} Da kupite odredjenu stvar iz prodavnice, koristite **.buy <slot>**.\n\n${this.client.emoji.key} **BOJE:**\n> ${this.client.emoji.heart} Crvena — ${this.client.emoji.bank} **10,000$** (**#17**)\n> ${this.client.emoji.zelena} Zelena — ${this.client.emoji.bank} **10,000$** (**#18**)\n> ${this.client.emoji.zuta} Žuta — ${this.client.emoji.bank} **10,000$** (**#19**)\n> ${this.client.emoji.plava} Plava — ${this.client.emoji.bank} **10,000$** (**#20**)\n> ${this.client.emoji.ljubicasta} Ljubičasta — ${this.client.emoji.bank} **10,000$** (**#21**)\n> ${this.client.emoji.roze} Roze — ${this.client.emoji.bank} **10,000$** (**#22**)\n> ${this.client.emoji.narandzasta} Narandžasta — ${this.client.emoji.bank} **10,000$** (**#23**)\n> ${this.client.emoji.crna} Crna — ${this.client.emoji.bank} **10,000$** (**#24**)\n> ${this.client.emoji.bela} Bela — ${this.client.emoji.bank} **10,000$** (**#25**)`),
        )

        await this.client.paginate.buttons(this.client, message, Embeds);
    }
}