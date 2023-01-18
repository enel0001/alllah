const { Schema, model } = require("mongoose")

module.exports = model("Champions", new Schema({
    ID: Number,
    Guild: String,
    Channel: String,
    Message: String,
    Time: String,
    Status: Boolean,
    Winner: String,
    Prize: String,
}))