const mongoose = require("mongoose");

const eventsSchema = new mongoose.Schema(
    {   
        /* Tested without id. It working. The structure comes from official tutorial */
        _id: mongoose.Schema.Types.ObjectId,
        name: String,
        day:Number,
        month:Number,
        date:Date,


    }
)

module.exports = mongoose.model("events", eventsSchema);