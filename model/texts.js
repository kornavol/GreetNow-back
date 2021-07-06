const mongoose = require("mongoose");

const textsSchema = new mongoose.Schema(
    {
        text: String,
        events: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'events'
        },]
    }
)

module.exports = mongoose.model("texts", textsSchema);

