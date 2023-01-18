const Base = require("../../base/util/client");
const CommandInterface = require("../../base/templates/command");

module.exports = class Economy extends CommandInterface {
    /**
     * @param {Base} client 
     * @param {import('discord.js').Message} message 
     * @param {Array<string>} args 
     */
    constructor(client) {
        super();
        this.client = client;
        this.name = "crime",
            this.category = "economy",
            this.description = "Počinite zločin i zaradite novac."
    };
    /**
     * @param {Base} client 
     * @param {import('discord.js').Message} message 
     * @param {Array<string>} args 
     */
    async execute(message, args) {
        const userData = await this.client.database.economy.findOne({ GuildID: message.guild.id, UserID: message.author.id });

        if (!userData || userData?.Cash < 500)
            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.no} Treba vam minimalno **500$** da počinite zločin.`,
                "Error",
            )

        const randomCrimes = [
            "Ubili ste sedam ljudi",
            "Opljačkali ste banku",
            "Opljačkali ste zlataru",
            "Roknuli ste rođenog brata",
            "Postali ste mafijaš i murija vas častila",
            "Oborili ste avion sa 180 osoba i 4 posade",
            "Patricia vas proganjala sa crnom magijom i dala bakšiš",
            "Harun ti dao keš da se više nikad ne motaš oko njegove žene",
            "Aldinova kurva ne želi da ti ga popuši pa ti vraća lovu",
            "Policajac vam je pronašao 2 grama vutre u džepu",
            "Koristili ste hemiju kako bi napravili drogu",
            "Silovali ste komšinicu od Aldina",
        ];

        const caughtResult = [
            true,
            false,
        ]

        const amount = this.client.util.randomNumber(500, userData.Cash);
        const caught = caughtResult[Math.floor(Math.random() * caughtResult.length)];
        const crime = randomCrimes[Math.floor(Math.random() * randomCrimes.length)];

        if (userData.Crime !== null && 300000 - (Date.now() - userData.Crime) > 0) {
            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.statistic} **CRIME:**\n> ${this.client.emoji.no} Već ste počinili zločin.\n> ${this.client.emoji.clock} Molimo vas sačekajte ${this.client.util.timeFormat(300000 - (Date.now() - userData.Crime))}.`,
                "Error"
            )
        } else {
            if (caught === true) {
                userData.Crime = Date.now();
                userData.Cash -= amount;
                userData.Transactions.push(`> **[-]** Neuspješno počinio zločin i izgubio **${amount}$**`);

                await userData.save();

                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.statistic} **CRIME:**\n> ${this.client.emoji.no} Uhvaćeni ste od strane policije.\n> ${this.client.emoji.minus} Izgubili ste **${this.client.util.cleanNumber(amount)}$**.`,
                    "Error"
                )
            } else {
                userData.Crime = Date.now();
                userData.Cash += amount;
                userData.Transactions.push(`> **[+]** Uspešno počinio zločin i zaradio **${amount}$**`);

                await userData.save();

                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.statistic} **CRIME:**\n> ${this.client.emoji.yes}  ${crime}.\n> ${this.client.emoji.plus} Dobili ste **${this.client.util.cleanNumber(amount)}$**.`,
                    "Success"
                )
            }
        }
    }
}