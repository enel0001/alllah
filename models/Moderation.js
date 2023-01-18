const { Schema, model } = require("mongoose")

module.exports = model("Moderation", new Schema({
    Guild: String,
    Case: String,
    Action: String,
    User: String,
    UserTag: String,
    Moderator: String,
    ModeratorTag: String,
    Reason: String,
    Date: String,
    EndingDate: String,
}))