const mongoose = require("mongoose");

const eventsSchema = new mongoose.Schema(
    {   
        /* added id from tutorial. Still not working */
        _id: mongoose.Schema.Types.ObjectId,
        name: String
    }
)

module.exports = mongoose.model("events", eventsSchema);