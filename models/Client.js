const { Schema, model } = require("mongoose")

module.exports = model("Client", new Schema({
    Client: String,
    Name: String,
    Uses: Number,
    Errors: Number,
}))