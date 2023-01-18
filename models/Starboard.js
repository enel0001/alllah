const { Schema, model } = require("mongoose")

module.exports = model("Starboard", new Schema({
    GuildID: String,
    MessageID: String,
    EmbedID: String,
    AuthorID: String,
    Posted: Boolean,
}))