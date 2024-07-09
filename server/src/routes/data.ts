import { Router } from "express";
import {
  fetchPortfolioCoinData,
  fetchAllCoins,
  fetchAllCoinsWithMarketDataPaginated,
  fetchAllCoinsWithMarketDataRecursive,
  fetchTotalMcapData,
  fetchSearchResults,
} from "../controllers/dataController";
import { authenticateJWT } from "../strategies/passportJwt";
const router = Router();

// GET -> /portfolio-coin-data
router.get("/portfolio-coin-data", authenticateJWT, fetchPortfolioCoinData);

// GET -> /all-coins
router.get("/all-coins", authenticateJWT, fetchAllCoins);

// GET -> /all-coins-with-market-data
router.get(
  "/all-coins-with-market-data",
  authenticateJWT,
  fetchAllCoinsWithMarketDataPaginated
);

// GET -> /all-coins-with-market-data-recursive
router.get(
  "/all-coins-with-market-data-recursive",
  authenticateJWT,
  fetchAllCoinsWithMarketDataRecursive
);

// GET -> /total-market-cap
router.get("/total-market-cap", authenticateJWT, fetchTotalMcapData);

// GET -> /search?query=
router.get("/search", authenticateJWT, fetchSearchResults);

export default router;
