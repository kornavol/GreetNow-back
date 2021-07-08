const mongoose = require("mongoose");

const textsSchema = new mongoose.Schema(
    {
        text: String,
        categories: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'categories'
        },],
        events: [{
            /* The last method 'here String' suppose to be same as 'key' in referenced document   */
            type: mongoose.Schema.Types.ObjectId,
            ref: 'events'
        },],
        type: String
    }
)

module.exports = mongoose.model("texts", textsSchema);

