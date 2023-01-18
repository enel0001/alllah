const Base = require("../../base/util/client");
const EventInterface = require("../../base/templates/event");
const mongoose = require("mongoose");
const { ActivityType, EmbedBuilder } = require('discord.js')
const CronJob = require('cron').CronJob;
const { inspect } = require("util");

module.exports = class ClientEvent extends EventInterface {
    /**
     * @param {Base} client 
     */
    constructor(client) {
        super()
        this.client = client;
        this.name = "ready"
    };

    async execute() {
        this.client.consoleLog(`Bot je učitao ${this.client.publicCommands.length || 0} komandi.`, "Success")

        await mongoose.connect(this.client.config.mongo, {
            useNewUrlParser: true, useUnifiedTopology: true
        }).then(() =>
            this.client.consoleLog("MongoDB je uspješno povezan.", "Success")
        ).catch((error) =>
            this.client.consoleLog("Ne mogu se povezati na MongoDB.", "Error")
        )

        this.client.consoleLog(`${this.client.user.username} je sada online za ${this.client.guilds.cache.size} servera.`, "Success")

        const config = await this.client.database.guild.findOne({ GuildID: this.client.config.guild })

        if (!config)
            new this.client.database.guild({
                GuildID: this.client.config.guild,
                AltDefender: true,
                WelcomeMessage: true,
                Links: true,
                ProfanityFilter: true,
                AntiCaps: true,
                AutoRole: true,
                BoostTracker: true,
                StatusTracker: true,
                Starboard: true,
                Applications: true,
                Security: true,
            }).save()

        new CronJob(
            '1 * * * * *',

            async () =>
                this.client.user.setPresence({
                    activities: [{ name: `${this.client.util.cleanNumber(this.client.guilds.cache.get(this.client.config.guild).memberCount)} korisnika`, type: ActivityType.Watching }],
                    status: 'dnd',
                }),

            null,
            true,

            'Europe/Belgrade'
        );

        new CronJob(
            '1 * * * * *',

            async () => {
                const guild = this.client.guilds.cache.get(this.client.config.guild);

                const data = await this.client.database.staff.find({ Guild: guild.id });

                if (data.length < 1) return;

                for (const staff of data) {
                    const member = guild.members.cache.get(staff.User);

                    if (!member || !member.roles.cache.has(this.client.settings.roles.staff))
                        staff.remove();
                }
            },

            null,
            true,

            'Europe/Belgrade'
        );

        new CronJob(
            '0 0 * * *',

            async () =>
                await this.client.database.staff.updateMany({}, { DutyToday: 0 }),

            null,
            true,

            'Europe/Belgrade'
        );

        const guild = this.client.guilds.cache.get(this.client.config.guild);

        await this.client.util.cacheInvite(this.client, guild);

        process.on("unhandledRejection", async (reason, promise) => {
            this.client.channels.cache.get(this.client.settings.autopost.errors).send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Unhandled Rejection")
                        .setDescription(`${this.client.emoji.settings} **REASON:**\n\`\`\`${inspect(reason, { depth: 0 }).slice(0, 1000)}\`\`\`\n${this.client.emoji.shield} **PROMISE:**\n\`\`\`${inspect(promise, { depth: 0 }).slice(0, 1000)}\`\`\``)
                        .setColor("#9fa8ff")
                        .setTimestamp()
                ]
            }).then(async (r) => {
                this.client.consoleLog(reason, "Error")
                await this.client.database.client.updateOne({ Client: this.client.user.id }, { $inc: { Errors: 1 } }, { upsert: true });
            }).catch((err) =>
                this.client.consoleLog(reason, "Error")
            )
        });

        process.on("uncaughtException", async (err, origin) => {
            this.client.channels.cache.get(this.client.settings.autopost.errors).send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`Uncaught Exception`)
                        .setDescription(`${this.client.emoji.settings} **ORIGIN:**\n\`\`\`${inspect(origin, { depth: 0 }).slice(0, 1000)}\`\`\`\n${this.client.emoji.shield} **ERROR:**\n\`\`\`${inspect(err, { depth: 0 }).slice(0, 1000)}\`\`\``)
                        .setColor("#9fa8ff")
                        .setTimestamp()
                ]
            }).then(async (r) => {
                this.client.consoleLog(err, "Error")
                await this.client.database.client.updateOne({ Client: this.client.user.id }, { $inc: { Errors: 1 } }, { upsert: true });
            }).catch(() =>
                this.client.consoleLog(err, "Error")
            )
        });

        process.on("uncaughtExceptionMonitor", async (err, origin) => {
            this.client.channels.cache.get(this.client.settings.autopost.errors).send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`Uncaught Exception Monitor`)
                        .setDescription(`${this.client.emoji.settings} **ORIGIN:**\n\`\`\`${inspect(origin, { depth: 0 }).slice(0, 1000)}\`\`\`\n${this.client.emoji.shield} **ERROR:**\n\`\`\`${inspect(err, { depth: 0 }).slice(0, 1000)}\`\`\``)
                        .setColor("#9fa8ff")
                        .setTimestamp()
                ]
            }).then(async (r) => {
                this.client.consoleLog(err, "Error")
                await this.client.database.client.updateOne({ Client: this.client.user.id }, { $inc: { Errors: 1 } }, { upsert: true });
            }).catch(() =>
                this.client.consoleLog(err, "Error")
            )
        });

        this.client.on("error", (err) => {
            this.client.channels.cache.get(this.client.settings.autopost.errors).send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`Discord API Error`)
                        .setDescription(`${this.client.emoji.settings} **ERROR:**\n\`\`\`${inspect(err, { depth: 0 }).slice(0, 1000)}\`\`\``)
                        .setColor("#9fa8ff")
                        .setTimestamp()
                ]
            }).then(async (r) => {
                this.client.consoleLog(err, "Error")
                await this.client.database.client.updateOne({ Client: this.client.user.id }, { $inc: { Errors: 1 } }, { upsert: true });
            }).catch(() =>
                this.client.consoleLog(err, "Error")
            )
        });
    }
}