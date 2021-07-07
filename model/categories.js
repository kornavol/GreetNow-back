const mongoose = require("mongoose");

const categoriesSchema = new mongoose.Schema(
    {   
        /* Tested without id. It working. The structure comes from official tutorial */
        _id: mongoose.Schema.Types.ObjectId,
        name: String
    }
)

module.exports = mongoose.model("categories", categoriesSchema);