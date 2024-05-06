const express = require("express");
const router = express.Router();
const passport = require("passport");
const coinsController = require("../controllers/coinsController");

// GET -> all coins
router.get(
  "/portfolio",
  passport.authenticate("jwt", { session: false }),
  coinsController.getPortfolio
);

// POST -> add a coin
router.post(
  "/add",
  passport.authenticate("jwt", { session: false }),
  coinsController.addCoin
);

module.exports = router;
