"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dataController_1 = require("../controllers/dataController");
const passportJwt_1 = require("../strategies/passportJwt");
const router = (0, express_1.Router)();
// GET -> /portfolio-coin-data
router.get("/portfolio-coin-data", passportJwt_1.authenticateJWT, dataController_1.fetchPortfolioCoinData);
// GET -> /all-coins
router.get("/all-coins", passportJwt_1.authenticateJWT, dataController_1.fetchAllCoins);
// GET -> /all-coins-with-market-data
router.get("/all-coins-with-market-data", passportJwt_1.authenticateJWT, dataController_1.fetchAllCoinsWithMarketDataPaginated);
// GET -> /all-coins-with-market-data-recursive
router.get("/all-coins-with-market-data-recursive", passportJwt_1.authenticateJWT, dataController_1.fetchAllCoinsWithMarketDataRecursive);
// GET -> /total-market-cap
router.get("/total-market-cap", passportJwt_1.authenticateJWT, dataController_1.fetchTotalMcapData);
// GET -> /search?query=
router.get("/search", passportJwt_1.authenticateJWT, dataController_1.fetchSearchResults);
exports.default = router;
