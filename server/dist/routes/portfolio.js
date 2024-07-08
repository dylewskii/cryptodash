"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const portfolioController_1 = require("../controllers/portfolioController");
const passportJwt_1 = require("../strategies/passportJwt");
const router = (0, express_1.Router)();
// GET -> all coins
router.get("/all-coins", passportJwt_1.authenticateJWT, portfolioController_1.getPortfolio);
// GET -> portfolio values
router.get("/portfolio-values", passportJwt_1.authenticateJWT, portfolioController_1.getPortfolioValues);
// POST -> add a coin
router.post("/add", passportJwt_1.authenticateJWT, portfolioController_1.addCoin);
// DELETE -> delete a coin
router.delete("/delete", passportJwt_1.authenticateJWT, portfolioController_1.deleteCoin);
// PATCH -> edit coin holding amount
router.patch("/edit", passportJwt_1.authenticateJWT, portfolioController_1.editCoin);
exports.default = router;
