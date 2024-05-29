const express = require("express");
const router = express.Router();
const passport = require("passport");
const dataController = require("../controllers/dataController");

// GET -> /portfolio-coin-data
router.get(
  "/portfolio-coin-data",
  passport.authenticate("jwt", { session: false }),
  dataController.fetchPortfolioCoinData
);

// GET -> /coins-list-with-data
router.get(
  "/coins-list-with-data",
  passport.authenticate("jwt", { session: false }),
  dataController.fetchCoinsListWithMarketData
);

// GET -> /all-coins
router.get(
  "/all-coins",
  passport.authenticate("jwt", { session: false }),
  dataController.fetchAllCoins
);

// GET -> /total-market-cap
router.get(
  "/total-market-cap",
  passport.authenticate("jwt", { session: false }),
  dataController.fetchTotalMcapData
);

module.exports = router;
