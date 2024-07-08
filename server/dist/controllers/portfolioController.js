"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editCoin = exports.deleteCoin = exports.addCoin = exports.getPortfolioValues = exports.getPortfolio = void 0;
const User_1 = require("../models/User");
const coinServices_1 = require("../services/coinServices");
const getPortfolio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(400).json({
                success: false,
                msg: "User ID could not be extracted from req.user",
            });
        }
        const userId = req.user.id;
        const user = yield User_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, msg: "User not found" });
        }
        res.status(200).json({
            success: true,
            msg: user.portfolio.length > 0
                ? "Portfolio retrieved successfully"
                : "Portfolio is empty",
            data: user.portfolio,
        });
    }
    catch (err) {
        console.error("Failed to retrieve portfolio:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});
exports.getPortfolio = getPortfolio;
const getPortfolioValues = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(400).json({
                success: false,
                msg: "User ID could not be extracted from req.user",
            });
        }
        const userId = req.user.id;
        const user = yield User_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, msg: "User not found" });
        }
        res.json({ success: true, data: user.portfolioValues });
    }
    catch (err) {
        console.error("Failed to retrieve portfolio values:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});
exports.getPortfolioValues = getPortfolioValues;
const addCoin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, amount } = req.body;
    if (!req.user) {
        return res.status(400).json({
            success: false,
            msg: "User ID could not be extracted from req.user",
        });
    }
    const userId = req.user.id;
    // check if coin id is valid (i.e exists within API)
    const isValidCoinId = yield (0, coinServices_1.isCoinIdValid)(id);
    if (!isValidCoinId) {
        return res.status(400).json({ success: false, msg: "Invalid coin ID" });
    }
    // convert amount to float num
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) {
        return res
            .status(400)
            .json({ success: false, msg: "Amount must be a number." });
    }
    try {
        const user = yield User_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, msg: "User not found" });
        }
        const coinAlreadyAddedToPortfolio = user.portfolio.some((coin) => {
            return id === coin.id;
        });
        if (coinAlreadyAddedToPortfolio) {
            console.log("Coin already exists within portfolio.");
            return res.status(409).json({
                success: false,
                msg: "Coin already exists within portfolio.",
            });
        }
        // add coin to user's portfolio array
        const newCoin = { id, amount: numericAmount };
        user.portfolio.push(newCoin);
        yield user.save();
        const io = req.app.get("socketio");
        io.emit("portfolioUpdated", { userId, portfolio: user.portfolio });
        res.json({
            success: true,
            message: "Coin added to portfolio successfully",
            coinData: newCoin,
        });
    }
    catch (err) {
        console.error("Failed to add coin:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});
exports.addCoin = addCoin;
const deleteCoin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { coinId } = req.body;
    if (!req.user) {
        return res.status(400).json({
            success: false,
            msg: "User ID could not be extracted from req.user",
        });
    }
    const userId = req.user.id;
    try {
        const user = yield User_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, msg: "User not found" });
        }
        const coinExists = user.portfolio.some((coin) => coin.id === coinId);
        if (!coinExists) {
            return res
                .status(404)
                .json({ success: false, msg: "Coin not found within portfolio" });
        }
        // $pull removes the coin from the user's portfolio
        const result = yield User_1.User.updateOne({ _id: userId }, { $pull: { portfolio: { id: coinId } } });
        // check if deletion was successful
        // if modifiedCount is 0 -> no documents were changed during the operation (i.e deletion failed)
        if (result.modifiedCount === 0) {
            return res.status(404).json({
                success: false,
                msg: "Coin deletion failed or already removed from portfolio ",
            });
        }
        // check if the portfolio is now empty and handle appropriately
        const updatedUser = yield User_1.User.findById(userId);
        if (!updatedUser) {
            throw new Error("Unable to find updated user in mongodb");
        }
        if (updatedUser.portfolio.length === 0) {
            // reset the portfolio to empty array
            yield User_1.User.updateOne({ _id: userId }, { $set: { portfolio: [] } });
        }
        const io = req.app.get("socketio");
        io.emit("portfolioUpdated", { userId, portfolio: updatedUser.portfolio });
        res.json({
            success: true,
            msg: `Coin deletion completed - ${coinId} removed from portfolio`,
        });
    }
    catch (err) {
        console.error("Failed to delete coin:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});
exports.deleteCoin = deleteCoin;
const editCoin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { coinId, editedAmount } = req.body;
    if (!req.user) {
        return res.status(400).json({
            success: false,
            msg: "User ID could not be extracted from req.user",
        });
    }
    const userId = req.user.id;
    try {
        const user = yield User_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, msg: "User not found" });
        }
        const coin = user.portfolio.find((c) => c.id === coinId);
        if (!coin) {
            return res.status(404).json({
                success: false,
                msg: "Coin not found in portfolio",
            });
        }
        coin.amount = editedAmount;
        yield user.save();
        const io = req.app.get("socketio");
        io.emit("portfolioUpdated", { userId, portfolio: user.portfolio });
        res.status(200).json({
            success: true,
            msg: "Coin amount updated successfully",
            portfolio: user.portfolio,
        });
    }
    catch (err) {
        console.error("Failed to edit coin:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});
exports.editCoin = editCoin;
