const express = require("express");
const router = express.Router();
const passport = require("passport");
const portfolioController = require("../controllers/portfolioController");

// GET -> all coins
router.get(
  "/all-coins",
  passport.authenticate("jwt", { session: false }),
  portfolioController.getPortfolio
);

// POST -> add a coin
router.post(
  "/add",
  passport.authenticate("jwt", { session: false }),
  portfolioController.addCoin
);

// DELETE -> delete a coin
router.delete(
  "/delete",
  passport.authenticate("jwt", { session: false }),
  portfolioController.deleteCoin
);

// PATCH -> edit coin holding amount
router.patch(
  "/edit",
  passport.authenticate("jwt", { session: false }),
  portfolioController.editCoin
);

module.exports = router;
