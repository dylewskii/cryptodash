import { Router } from "express";
import {
  getPortfolio,
  getPortfolioValues,
  addCoin,
  deleteCoin,
  editCoin,
} from "../controllers/portfolioController";
import { authenticateJWT } from "../strategies/passportJwt";
const router = Router();

// GET -> all coins
router.get("/all-coins", authenticateJWT, getPortfolio);

// GET -> portfolio values
router.get("/portfolio-values", authenticateJWT, getPortfolioValues);

// POST -> add a coin
router.post("/add", authenticateJWT, addCoin);

// DELETE -> delete a coin
router.delete("/delete", authenticateJWT, deleteCoin);

// PATCH -> edit coin holding amount
router.patch("/edit", authenticateJWT, editCoin);

export default router;
