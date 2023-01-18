const { Schema, model } = require("mongoose")

module.exports = model("Economy", new Schema({
    GuildID: String,
    UserID: String,
    Cash: Number,
    Bank: Number,
    Transactions: Array,
    Work: String,
    Daily: String,
    Weekly: String,
    CrashRunning: Boolean,
    BlackJackRunning: Boolean,
    Crime: String,
    Rob: String,
    EconomyBooster: Boolean,
    EconomyBoosterEnd: String,
    EconomyBoosterMultiplier: Number,
    XPBooster: Boolean,
    XPBoosterEnd: String,
    XPBoosterMultiplier: Number,
    Starter: String,
    Hero: String,
    Legend: String,
    Diamond: String,
    Emerald: String,
    Ruby: String,
    Spartan: String,
    Immortal: String,
    Indigo: String,
    God: String
}))