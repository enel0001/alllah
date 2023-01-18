const { Schema, model } = require("mongoose")

module.exports = model("Giveaway", new Schema({
    GuildID: String,
    MessageID: String,
    ChannelID: String,
    ID: Number,
    Status: Boolean,
    Prize: String,
    Hoster: String,
    Time: String,
    Winner: String,
    Entries: Array,
    Invites: Number,
    Messages: Number,
    Ending: String,
}))