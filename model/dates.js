const mongoose = require("mongoose");

const datesSchema = new mongoose.Schema({
    date: String, // maybe Date
    checked: Boolean
});

module.exports = mongoose.model("dates", datesSchema);