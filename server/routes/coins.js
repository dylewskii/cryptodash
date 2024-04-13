const express = require("express");
const router = express.Router();
const Coin = require("../models/Coin");

// GET -> all coins
router.get("/", async (req, res) => {
  try {
    const coins = await Coin.find();
    res.json(coins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
