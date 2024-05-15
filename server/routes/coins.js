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

// DELETE -> delete a coin
router.delete(
  "/delete",
  passport.authenticate("jwt", { session: false }),
  coinsController.deleteCoin
);

// PATCH -> edit coin holding amount
router.patch(
  "/edit",
  passport.authenticate("jwt", { session: false }),
  coinsController.editCoin
);

module.exports = router;
