const express = require("express");
const router = express.Router();
const dataController = require("../controllers/dataController");
const { authenticateJWT } = require("../strategies/passportJwt");

// GET -> /portfolio-coin-data
router.get(
  "/portfolio-coin-data",
  authenticateJWT,
  dataController.fetchPortfolioCoinData
);

// GET -> /all-coins
router.get("/all-coins", authenticateJWT, dataController.fetchAllCoins);

// GET -> /all-coins-with-market-data
router.get(
  "/all-coins-with-market-data",
  authenticateJWT,
  dataController.fetchAllCoinsWithMarketDataPaginated
);

// GET -> /all-coins-with-market-data-recursive
router.get(
  "/all-coins-with-market-data-recursive",
  authenticateJWT,
  dataController.fetchAllCoinsWithMarketDataRecursive
);

// GET -> /total-market-cap
router.get(
  "/total-market-cap",
  authenticateJWT,
  dataController.fetchTotalMcapData
);

module.exports = router;
