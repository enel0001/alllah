const Base = require("../../base/util/client");
const EventInterface = require("../../base/templates/event");
const { EmbedBuilder, ComponentType, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js")
const ms = require("ms")

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

        const giveaways = await this.client.database.giveaway.find({ GuildID: guild.id })

        if (!giveaways)
            return;

        if (giveaways.length > 0) {
            giveaways.filter(g => g.Status === true).forEach(async (giveaway) => {
                if (Date.now() > giveaway.Ending) {
                    const channel = guild.channels.cache.get(giveaway.ChannelID)
                    const message = await channel.messages.fetch(giveaway.MessageID)

                    if (!message)
                        return;

                    const ButtonDisabled = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`🎁`)
                            .setDisabled(true)
                            .setCustomId(`button`)
                    )

                    const vrijeme = ((Number.parseInt(giveaway.Ending) * 1000) - Date.now())

                    setTimeout(async () => {
                        if (giveaway.Status === false) {
                            const Entries = new EmbedBuilder()
                                .setColor("#9fa8ff")
                                .setTimestamp()
                                .setDescription(`${this.client.emoji.diamond} **INFORMACIJE:**\n> ${this.client.emoji.valid} Giveaway je završio i imamo pobjednika.\n\n${this.client.emoji.gift} **GIVEAWAY:**\n> ${this.client.emoji.frame} ID: **${giveaway.ID}**\n> ${this.client.emoji.prize} Nagrada: **${giveaway.Prize}**\n> ${this.client.emoji.human} Pokrenut od: **${this.client.users.cache.get(giveaway.Hoster) ? this.client.users.cache.get(giveaway.Hoster).tag : "Nepoznat korisnik/ca"}**\n> ${this.client.emoji.crown} Pobjednik: **${this.client.users.cache.get(giveaway.Winner) ? this.client.users.cache.get(giveaway.Winner).tag : "Nepoznat korisnik/ca"}**\n> ${this.client.emoji.calendar} Ukupno ulazaka: **${giveaway.Entries.length}**`)

                            return message.edit({ content: `${this.client.emoji.prize} NAGRADNA IGRA ZAVRŠENA ${this.client.emoji.prize}`, embeds: [Entries], components: [ButtonDisabled] })
                        };

                        if (!giveaway) {
                            const Entries = new EmbedBuilder()
                                .setColor("#ff3838")
                                .setTimestamp()
                                .setDescription(`${this.client.emoji.diamond} **INFORMACIJE:**\n> ${this.client.emoji.valid} Giveaway je završio jer nema dovoljno ulazaka.\n\n${this.client.emoji.gift} **GIVEAWAY:**\n> ${this.client.emoji.frame} ID: **${giveaway.ID}**\n> ${this.client.emoji.prize} Nagrada: **${giveaway.Prize}**\n> ${this.client.emoji.human} Pokrenut od: **${this.client.users.cache.get(giveaway.Hoster) ? this.client.users.cache.get(giveaway.Hoster).tag : "Nepoznat korisnik/ca"}**`)

                            return message.edit({ content: `${this.client.emoji.prize} NAGRADNA IGRA ZAVRŠENA ${this.client.emoji.prize}`, embeds: [Entries], components: [ButtonDisabled] })
                        };

                        if (giveaway.Entries.length === 0) {
                            giveaway.Status = false;
                            giveaway.Ending = (Date.now() / 1000).toFixed();

                            await giveaway.save()

                            const Entries = new EmbedBuilder()
                                .setColor("#ff3838")
                                .setTimestamp()
                                .setDescription(`${this.client.emoji.diamond} **INFORMACIJE:**\n> ${this.client.emoji.valid} Giveaway je završio jer nema dovoljno ulazaka.\n\n${this.client.emoji.gift} **GIVEAWAY:**\n> ${this.client.emoji.frame} ID: **${giveaway.ID}**\n> ${this.client.emoji.prize} Nagrada: **${giveaway.Prize}**\n> ${this.client.emoji.human} Pokrenut od: **${this.client.users.cache.get(giveaway.Hoster) ? this.client.users.cache.get(giveaway.Hoster).tag : "Nepoznat korisnik/ca"}**`)

                            return message.edit({ content: `${this.client.emoji.prize} NAGRADNA IGRA ZAVRŠENA ${this.client.emoji.prize}`, embeds: [Entries], components: [ButtonDisabled] })
                        } else {
                            var list = Math.floor(Math.random() * giveaway.Entries.length);
                            var winnerarray = giveaway.Entries[list];

                            const winner = this.client.users.cache.get(winnerarray) ? this.client.users.cache.get(winnerarray).tag : "Nepoznat korisnik/ca";

                            giveaway.Status = false;
                            giveaway.Ending = (Date.now() / 1000).toFixed();
                            giveaway.Winner = winnerarray;

                            await giveaway.save()

                            const Entries = new EmbedBuilder()
                                .setColor("#9fa8ff")
                                .setTimestamp()
                                .setDescription(`${this.client.emoji.diamond} **INFORMACIJE:**\n> ${this.client.emoji.valid} Giveaway je završio i imamo pobjednika.\n\n${this.client.emoji.gift} **GIVEAWAY:**\n> ${this.client.emoji.frame} ID: **${giveaway.ID}**\n> ${this.client.emoji.prize} Nagrada: **${giveaway.Prize}**\n> ${this.client.emoji.human} Pokrenut od: **${this.client.users.cache.get(giveaway.Hoster) ? this.client.users.cache.get(giveaway.Hoster).tag : "Nepoznat korisnik/ca"}**\n> ${this.client.emoji.crown} Pobjednik: **${winner}**\n> ${this.client.emoji.calendar} Ukupno ulazaka: **${giveaway.Entries.length}**`)

                            message.edit({ content: `${this.client.emoji.prize} NAGRADNA IGRA ZAVRŠENA ${this.client.emoji.prize}`, embeds: [Entries], components: [ButtonDisabled] })

                            await message.reply(`Čestitke, korisnik <@${winnerarray}> je osvojio **${giveaway.Prize}**`)

                            giveaway.Entries = giveaway.Entries.filter(user => user !== winnerarray);

                            return await giveaway.save()
                        }
                    }, vrijeme)


                    const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: vrijeme });

                    collector.on('end', async i => {
                        return message.edit({ components: [ButtonDisabled] })
                    })

                    collector.on('collect', async i => {
                        if (i.customId === 'button') {
                            if (!giveaway)
                                return i.deferUpdate();

                            if (guild.members.cache.get(i.user.id).roles.cache.has(this.client.settings.roles.booster)) {
                                if (giveaway.Entries.includes(i.user.id)) {
                                    i.deferUpdate()

                                    return this.client.users.cache.get(i.user.id).send({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setColor("#ff3838")
                                                .setAuthor({ name: i.user.tag, iconURL: i.user.displayAvatarURL({ dynamic: true }) })
                                                .setTimestamp()
                                                .setDescription(`${this.client.emoji.no} Već si uključen/a u giveaway.`)
                                        ]
                                    })
                                }

                                giveaway.Entries.push(i.user.id)

                                await giveaway.save()

                                i.deferUpdate();

                                const Entries = new EmbedBuilder()
                                    .setColor("#9fa8ff")
                                    .setTimestamp()
                                    .setImage("https://cdn.discordapp.com/attachments/942778007842594846/1019199665880694815/BT.png")
                                    .setDescription(`${this.client.emoji.gift} **GIVEAWAY:**\n> ${this.client.emoji.frame} ID: **${giveaway.ID}**\n> ${this.client.emoji.prize} Nagrada: **${giveaway.Prize}**\n> ${this.client.emoji.clock} Završava za: <t:${giveaway.Ending}:R>\n> ${this.client.emoji.human} Pokrenut od: **${this.client.users.cache.get(giveaway.Hoster) ? this.client.users.cache.get(giveaway.Hoster).tag : "Nepoznat korisnik/ca"}**\n> ${this.client.emoji.calendar} Ukupno ulazaka: **${giveaway.Entries.length}**\n\n${this.client.emoji.statistic} **ZAHTJEV:**\n> ${this.client.emoji.key} ${giveaway.Invites} invites\n> ${this.client.emoji.frame} ${giveaway.Messages} messages\n> ${this.client.emoji.crown} Bypass: <@&${this.client.settings.roles.booster}>`)

                                message.edit({ embeds: [Entries] })

                                return this.client.users.cache.get(i.user.id).send({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setColor("#33ff81")
                                            .setAuthor({ name: i.user.tag, iconURL: i.user.displayAvatarURL({ dynamic: true }) })
                                            .setTimestamp()
                                            .setDescription(`${this.client.emoji.yes} Uspješno ste se uključili u giveaway.`)
                                    ]
                                })
                            }

                            if (giveaway.Invites === 0 && giveaway.Messages === 0) {
                                if (giveaway.Entries.includes(i.user.id)) {
                                    i.deferUpdate()

                                    return this.client.users.cache.get(i.user.id).send({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setColor("#ff3838")
                                                .setAuthor({ name: i.user.tag, iconURL: i.user.displayAvatarURL({ dynamic: true }) })
                                                .setTimestamp()
                                                .setDescription(`${this.client.emoji.no} Već si uključen/a u giveaway.`)
                                        ]
                                    })
                                }

                                giveaway.Entries.push(i.user.id)

                                await giveaway.save()

                                i.deferUpdate();

                                const Entries = new EmbedBuilder()
                                    .setColor("#9fa8ff")
                                    .setTimestamp()
                                    .setImage("https://cdn.discordapp.com/attachments/942778007842594846/1019199665880694815/BT.png")
                                    .setDescription(`${this.client.emoji.gift} **GIVEAWAY:**\n> ${this.client.emoji.frame} ID: **${giveaway.ID}**\n> ${this.client.emoji.prize} Nagrada: **${giveaway.Prize}**\n> ${this.client.emoji.clock} Završava za: <t:${giveaway.Ending}:R>\n> ${this.client.emoji.human} Pokrenut od: **${this.client.users.cache.get(giveaway.Hoster) ? this.client.users.cache.get(giveaway.Hoster).tag : "Nepoznat korisnik/ca"}**\n> ${this.client.emoji.calendar} Ukupno ulazaka: **${giveaway.Entries.length}**\n\n${this.client.emoji.statistic} **ZAHTJEV:**\n> ${this.client.emoji.key} ${giveaway.Invites} invites\n> ${this.client.emoji.frame} ${giveaway.Messages} messages\n> ${this.client.emoji.crown} Bypass: <@&${this.client.settings.roles.booster}>`)

                                message.edit({ embeds: [Entries] })

                                return this.client.users.cache.get(i.user.id).send({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setColor("#33ff81")
                                            .setAuthor({ name: i.user.tag, iconURL: i.user.displayAvatarURL({ dynamic: true }) })
                                            .setTimestamp()
                                            .setDescription(`${this.client.emoji.yes} Uspješno ste se uključili u giveaway.`)
                                    ]
                                })
                            } else if (giveaway.Invites !== 0 && giveaway.Messages === 0) {
                                const userData = await this.client.database.user.findOne({ Guild: message.guild.id, User: i.user.id })

                                if (!userData) {
                                    i.deferUpdate()

                                    return this.client.users.cache.get(i.user.id).send({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setColor("#ff3838")
                                                .setAuthor({ name: i.user.tag, iconURL: i.user.displayAvatarURL({ dynamic: true }) })
                                                .setTimestamp()
                                                .setDescription(`${this.client.emoji.no} Nemate dovoljno pozivnica za ulazak.`)
                                        ]
                                    })
                                }

                                if (userData.Invites < giveaway.Invites) {
                                    i.deferUpdate()

                                    return this.client.users.cache.get(i.user.id).send({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setColor("#ff3838")
                                                .setTimestamp()
                                                .setAuthor({ name: i.user.tag, iconURL: i.user.displayAvatarURL({ dynamic: true }) })
                                                .setDescription(`${this.client.emoji.no} Nemate dovoljno pozivnica za ulazak.`)
                                        ]
                                    })
                                }

                                else if (userData.Invites >= giveaway.Invites) {
                                    if (giveaway.Entries.includes(i.user.id)) {
                                        i.deferUpdate()

                                        return this.client.users.cache.get(i.user.id).send({
                                            embeds: [
                                                new EmbedBuilder()
                                                    .setColor("#ff3838")
                                                    .setAuthor({ name: i.user.tag, iconURL: i.user.displayAvatarURL({ dynamic: true }) })
                                                    .setTimestamp()
                                                    .setDescription(`${this.client.emoji.no} Već si uključen/a u giveaway.`)
                                            ]
                                        })
                                    }

                                    giveaway.Entries.push(i.user.id)

                                    await giveaway.save()

                                    i.deferUpdate();

                                    const Entries = new EmbedBuilder()
                                        .setColor("#9fa8ff")
                                        .setTimestamp()
                                        .setImage("https://cdn.discordapp.com/attachments/942778007842594846/1019199665880694815/BT.png")
                                        .setDescription(`${this.client.emoji.gift} **GIVEAWAY:**\n> ${this.client.emoji.frame} ID: **${giveaway.ID}**\n> ${this.client.emoji.prize} Nagrada: **${giveaway.Prize}**\n> ${this.client.emoji.clock} Završava za: <t:${giveaway.Ending}:R>\n> ${this.client.emoji.human} Pokrenut od: **${this.client.users.cache.get(giveaway.Hoster) ? this.client.users.cache.get(giveaway.Hoster).tag : "Nepoznat korisnik/ca"}**\n> ${this.client.emoji.calendar} Ukupno ulazaka: **${giveaway.Entries.length}**\n\n${this.client.emoji.statistic} **ZAHTJEV:**\n> ${this.client.emoji.key} ${giveaway.Invites} invites\n> ${this.client.emoji.frame} ${giveaway.Messages} messages\n> ${this.client.emoji.crown} Bypass: <@&${this.client.settings.roles.booster}>`)

                                    message.edit({ embeds: [Entries] })

                                    return this.client.users.cache.get(i.user.id).send({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setColor("#33ff81")
                                                .setAuthor({ name: i.user.tag, iconURL: i.user.displayAvatarURL({ dynamic: true }) })
                                                .setTimestamp()
                                                .setDescription(`${this.client.emoji.yes} Uspješno ste se uključili u giveaway.`)
                                        ]
                                    })
                                } else {
                                    return i.deferUpdate()
                                }
                            } else if (giveaway.Invites === 0 && giveaway.Messages !== 0) {
                                const userData = await this.client.database.user.findOne({ Guild: message.guild.id, User: i.user.id })

                                if (!userData) {
                                    i.deferUpdate()

                                    return this.client.users.cache.get(i.user.id).send({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setColor("#ff3838")
                                                .setTimestamp()
                                                .setAuthor({ name: i.user.tag, iconURL: i.user.displayAvatarURL({ dynamic: true }) })
                                                .setDescription(`${this.client.emoji.no} Nemate dovoljno poruka za ulazak.`)
                                        ]
                                    })
                                }

                                if (userData.Messages < giveaway.Messages) {
                                    i.deferUpdate()

                                    return this.client.users.cache.get(i.user.id).send({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setColor("#ff3838")
                                                .setAuthor({ name: i.user.tag, iconURL: i.user.displayAvatarURL({ dynamic: true }) })
                                                .setTimestamp()
                                                .setDescription(`${this.client.emoji.no} Nemate dovoljno poruka za ulazak.`)
                                        ]
                                    })
                                }

                                else if (userData.Messages >= giveaway.Messages) {
                                    if (giveaway.Entries.includes(i.user.id)) {
                                        i.deferUpdate()

                                        return this.client.users.cache.get(i.user.id).send({
                                            embeds: [
                                                new EmbedBuilder()
                                                    .setColor("#ff3838")
                                                    .setTimestamp()
                                                    .setAuthor({ name: i.user.tag, iconURL: i.user.displayAvatarURL({ dynamic: true }) })
                                                    .setDescription(`${this.client.emoji.no} Već si uključen/a u giveaway.`)
                                            ]
                                        })
                                    }

                                    giveaway.Entries.push(i.user.id)

                                    await giveaway.save()

                                    i.deferUpdate();

                                    const Entries = new EmbedBuilder()
                                        .setColor("#9fa8ff")
                                        .setImage("https://cdn.discordapp.com/attachments/942778007842594846/1019199665880694815/BT.png")
                                        .setTimestamp()
                                        .setDescription(`${this.client.emoji.gift} **GIVEAWAY:**\n> ${this.client.emoji.frame} ID: **${giveaway.ID}**\n> ${this.client.emoji.prize} Nagrada: **${giveaway.Prize}**\n> ${this.client.emoji.clock} Završava za: <t:${giveaway.Ending}:R>\n> ${this.client.emoji.human} Pokrenut od: **${this.client.users.cache.get(giveaway.Hoster) ? this.client.users.cache.get(giveaway.Hoster).tag : "Nepoznat korisnik/ca"}**\n> ${this.client.emoji.calendar} Ukupno ulazaka: **${giveaway.Entries.length}**\n\n${this.client.emoji.statistic} **ZAHTJEV:**\n> ${this.client.emoji.key} ${giveaway.Invites} invites\n> ${this.client.emoji.frame} ${giveaway.Messages} messages\n> ${this.client.emoji.crown} Bypass: <@&${this.client.settings.roles.booster}>`)

                                    message.edit({ embeds: [Entries] })

                                    return this.client.users.cache.get(i.user.id).send({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setColor("#33ff81")
                                                .setAuthor({ name: i.user.tag, iconURL: i.user.displayAvatarURL({ dynamic: true }) })
                                                .setTimestamp()
                                                .setDescription(`${this.client.emoji.yes} Uspješno ste se uključili u giveaway.`)
                                        ]
                                    })
                                } else {
                                    return i.deferUpdate()
                                }
                            } else if (giveaway.Invites !== 0 && giveaway.Messages !== 0) {
                                const userData = await this.client.database.user.findOne({ Guild: message.guild.id, User: i.user.id })

                                if (!userData) {
                                    i.deferUpdate()

                                    return this.client.users.cache.get(i.user.id).send({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setColor("#ff3838")
                                                .setAuthor({ name: i.user.tag, iconURL: i.user.displayAvatarURL({ dynamic: true }) })
                                                .setTimestamp()
                                                .setDescription(`${this.client.emoji.no} Nemate dovoljno poruka za ulazak.`)
                                        ]
                                    })
                                }

                                if (userData.Messages < giveaway.Messages && userData.Invites < giveaway.Invites) {
                                    i.deferUpdate()

                                    return this.client.users.cache.get(i.user.id).send({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setColor("#ff3838")
                                                .setTimestamp()
                                                .setAuthor({ name: i.user.tag, iconURL: i.user.displayAvatarURL({ dynamic: true }) })
                                                .setDescription(`${this.client.emoji.no} Nemate dovoljno poruka za ulazak.`)
                                        ]
                                    })
                                }

                                else if (userData.Messages >= giveaway.Messages && userData.Invites >= giveaway.Invites) {
                                    if (giveaway.Entries.includes(i.user.id)) {
                                        i.deferUpdate()

                                        return this.client.users.cache.get(i.user.id).send({
                                            embeds: [
                                                new EmbedBuilder()
                                                    .setColor("#ff3838")
                                                    .setTimestamp()
                                                    .setAuthor({ name: i.user.tag, iconURL: i.user.displayAvatarURL({ dynamic: true }) })
                                                    .setDescription(`${this.client.emoji.no} Već si uključen/a u giveaway.`)
                                            ]
                                        })
                                    }

                                    giveaway.Entries.push(i.user.id)

                                    await giveaway.save()

                                    i.deferUpdate();

                                    const Entries = new EmbedBuilder()
                                        .setColor("#9fa8ff")
                                        .setTimestamp()
                                        .setImage("https://cdn.discordapp.com/attachments/942778007842594846/1019199665880694815/BT.png")
                                        .setDescription(`${this.client.emoji.gift} **GIVEAWAY:**\n> ${this.client.emoji.frame} ID: **${giveaway.ID}**\n> ${this.client.emoji.prize} Nagrada: **${giveaway.Prize}**\n> ${this.client.emoji.clock} Završava za: <t:${giveaway.Ending}:R>\n> ${this.client.emoji.human} Pokrenut od: **${this.client.users.cache.get(giveaway.Hoster) ? this.client.users.cache.get(giveaway.Hoster).tag : "Nepoznat korisnik/ca"}**\n> ${this.client.emoji.calendar} Ukupno ulazaka: **${giveaway.Entries.length}**\n\n${this.client.emoji.statistic} **ZAHTJEV:**\n> ${this.client.emoji.key} ${giveaway.Invites} invites\n> ${this.client.emoji.frame} ${giveaway.Messages} messages\n> ${this.client.emoji.crown} Bypass: <@&${this.client.settings.roles.booster}>`)

                                    message.edit({ embeds: [Entries] })

                                    return this.client.users.cache.get(i.user.id).send({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setColor("#33ff81")
                                                .setAuthor({ name: i.user.tag, iconURL: i.user.displayAvatarURL({ dynamic: true }) })
                                                .setTimestamp()
                                                .setDescription(`${this.client.emoji.yes} Uspješno ste se uključili u giveaway.`)
                                        ]
                                    })
                                } else {
                                    return i.deferUpdate()
                                }
                            } else {
                                return i.deferUpdate()
                            }
                        }
                    })
                }
            })
        }
    }
}