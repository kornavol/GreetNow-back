const mongoose = require("mongoose");

const picturesSchema = new mongoose.Schema(
    {   
        num: Number,
        name:String,
        categories: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'categories'
        },],
        events: [{
            /* The last method 'here String' suppose to be same as 'key' in referenced document   */
            type: mongoose.Schema.Types.ObjectId,
            ref: 'events'
        },]
    }
)

module.exports = mongoose.model("pictures", picturesSchema);