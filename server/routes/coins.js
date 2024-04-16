const express = require("express");
const router = express.Router();
const Coin = require("../models/Coin");
const coinsController = require("../controllers/coinsController");

// GET -> all coins
router.get("/", coinsController.getAllCoins);

module.exports = router;
