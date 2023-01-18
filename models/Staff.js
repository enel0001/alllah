const { Schema, model } = require("mongoose")

module.exports = model("Staff", new Schema({
    Guild: String,
    User: String,
    Plus: Number,
    Minus: Number,
    History: Array,
    DutyStatus: Boolean,
    DutyStart: Number,
    DutyTime: Number,
    DutyToday: Number,
    Activity: Number,
}));