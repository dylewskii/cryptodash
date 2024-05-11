const express = require("express");
const router = express.Router();
const passport = require("passport");
const dataController = require("../controllers/dataController");

// GET -> /coins-list-with-data
router.get(
  "/coins-list-with-data",
  passport.authenticate("jwt", { session: false }),
  dataController.fetchCoinsListWithMarketData
);

// GET -> /total-market-cap
router.get(
  "/total-market-cap",
  passport.authenticate("jwt", { session: false }),
  dataController.fetchTotalMcapData
);

module.exports = router;
