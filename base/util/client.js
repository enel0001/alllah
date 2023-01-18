const { Client, Collection } = require("discord.js");

module.exports = class Base extends Client {
    constructor() {
        super({ intents: 131071, partials: [] });
        this.publicCommands = [];
        this.commands = new Collection();
        this.events = new Collection();
        this.marriages = new Collection();
        this.invites = new Collection();
        this.voice = new Collection();
        this.config = require(`${process.cwd()}/data/config.js`);
        this.settings = require(`${process.cwd()}/data/settings.js`);
        this.emoji = require(`${process.cwd()}/data/emojis.js`);
        this.handlers = new (require("./handlers"))(this);
        this.util = require("../../utils/Util");
        this.database = {
            user: require("../../models/User"),
            moderation: require("../../models/Moderation"),
            staff: require("../../models/Staff"),
            client: require("../../models/Client"),
            starboard: require("../../models/Starboard"),
            giveaway: require("../../models/Giveaway"),
            tickets: require("../../models/Ticket"),
            guild: require("../../models/Guild"),
            champions: require("../../models/Champions"),
            economy: require("../../models/Economy"),
        }
        this.paginate = {
            buttons: require('../../utils/ButtonPagination'),
            select: require('../../utils/SelectPagination')
        }
    }

    start() {
        this.loadHandlers();
        this.login(this.config.token).catch((err) => { this.consoleLog(`Token je pogrešan, promjenite ga i pokušajte ponovo.`, "Error") });
    }

    loadHandlers() {
        this.handlers.loadCommands();
        this.handlers.loadEvents();
    }

    consoleLog(message, type = "Default") {
        if (type === "Default") console.log(`\x1b[33m[${new Date().toLocaleString()}] ${message}\x1b[0m`)
        else if (type === "Success") console.log(`\x1b[32m[${new Date().toLocaleString()}] ${message}\x1b[0m`)
        else if (type === "Error") console.log(`\x1b[31m[${new Date().toLocaleString()}] ${message}\x1b[0m`)
    }
}