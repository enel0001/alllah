const { Schema, model } = require("mongoose")

module.exports = model("Guild", new Schema({
    GuildID: String,
    AltDefender: Boolean,
    WelcomeMessage: Boolean,
    Links: Boolean,
    ProfanityFilter: Boolean,
    AntiCaps: Boolean,
    AutoRole: Boolean,
    BoostTracker: Boolean,
    StatusTracker: Boolean,
    Starboard: Boolean,
    Applications: Boolean,
    Security: Boolean,
}))