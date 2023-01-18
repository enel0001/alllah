const { Schema, model } = require("mongoose")

module.exports = model("Ticket", new Schema({
    GuildID: String,
    OwnerID: String,
    ID: Number,
    ChannelName: String,
    ChannelID: String,
    MessageID: String,
    Panel: String,
    ParentID: String,
    Created: String,
    Closed: Boolean,
    ClosedBy: String,
}))