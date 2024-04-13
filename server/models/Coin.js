const mongoose = require("mongoose");

const CoinSchema = new mongoose.Schema({
  name: String,
  amount: Number,
  symbol: String,
});

module.exports = mongoose.model("Coin", CoinSchema);
