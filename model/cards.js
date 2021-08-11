const mongoose = require("mongoose");

const cardsSchema = new mongoose.Schema({
  text: String,
  picture: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
});

module.exports = mongoose.model("cards", cardsSchema);
