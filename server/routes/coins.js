const express = require("express");
const router = express.Router();
const Coin = require("../models/Coin");
const coinsController = require("../controllers/coinsController");

// GET -> all coins
router.get("/all", coinsController.getAllCoins);

// POST -> add a coin
router.post("/add", coinsController.addCoin);

module.exports = router;
