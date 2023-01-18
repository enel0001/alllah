const Base = require("../../base/util/client");
const EventInterface = require("../../base/templates/event");
const { EmbedBuilder, StickerPack } = require('discord.js')

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
        let prefix;

        if (message.content.toLowerCase().startsWith("."))
            prefix = ".";

        if (message.content.indexOf(prefix) !== 0)
            return;

        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();
        const cmd = this.client.commands.get(command) || this.client.commands.find(c => c.aliases && c.aliases.includes(command));

        if (!cmd)
            return;

        if (cmd.category === "economy") {
            if (!message.member.permissions.has("ManageGuild")) {
                if (!this.client.settings.economy.includes(message.channel.id))
                    return message.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                                .setDescription(`${this.client.emoji.no} Molimo koristite komandu u kanalu za ekonomiju.`)
                                .setColor("#ff3838")
                                .setTimestamp()
                        ]
                    }).then(async (m) => {
                        sleep(3000).then(r => {
                            m.delete();

                            message.delete();
                        })
                    })
            }
        } else {
            if (cmd.name != "avatar" && cmd.name !== "afk") {
                if (!message.member.permissions.has("ManageGuild")) {
                    if (message.channel.id === this.client.settings.dopisivanje) {
                        return message.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                                    .setDescription(`${this.client.emoji.no} Molimo koristite komandu u kanalu <#1035582671511900221>`)
                                    .setColor("#ff3838")
                                    .setTimestamp()
                            ]
                        }).then(async (m) => {
                            sleep(3000).then(r => {
                                m.delete();

                                message.delete();
                            })
                        })
                    }
                }
            }
        }

        if (cmd.permission)
            if (!message.member.permissions.has(cmd.permission))
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Nemate dozvolu za korištenje ove komande.`,
                    "Error",
                );

        if (cmd.role)
            if (!message.member.roles.cache.has(cmd.role) && !message.member.permissions.has("Administrator"))
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Potreban vam je role <@&${cmd.role}> ili permisija \`Administrator\` za korištenje ove komande.`,
                    "Error",
                );

        if (cmd.dev)
            if (!this.client.config.devs.includes(message.author.id))
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Ova komanda je samo za developere.`,
                    "Error",
                );

        cmd.execute(message, args).then(async () => {
            await this.client.database.client.updateOne({ Client: this.client.user.id, Name: cmd.name }, { $inc: { Uses: 1 } }, { upsert: true });
        })
    }
}

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}