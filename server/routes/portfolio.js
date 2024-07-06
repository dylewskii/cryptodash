const express = require("express");
const router = express.Router();
const portfolioController = require("../controllers/portfolioController");
const { authenticateJWT } = require("../strategies/passportJwt");

// GET -> all coins
router.get("/all-coins", authenticateJWT, portfolioController.getPortfolio);

// GET -> portfolio values
router.get(
  "/portfolio-values",
  authenticateJWT,
  portfolioController.getPortfolioValues
);

// POST -> add a coin
router.post("/add", authenticateJWT, portfolioController.addCoin);

// DELETE -> delete a coin
router.delete("/delete", authenticateJWT, portfolioController.deleteCoin);

// PATCH -> edit coin holding amount
router.patch("/edit", authenticateJWT, portfolioController.editCoin);

module.exports = router;
