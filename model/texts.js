const mongoose = require("mongoose");

const textsSchema = new mongoose.Schema(
    {
        text: String,
        events: [{
            /* The last method 'here String' suppose to be same as 'key' in referenced document   */
            type: mongoose.Schema.Types.String,
            ref: 'events'
        },]
    }
)

module.exports = mongoose.model("texts", textsSchema);

