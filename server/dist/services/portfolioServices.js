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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPortfolioValue = exports.fetchPortfolioValue = exports.fetchCoinPrice = void 0;
const User_1 = require("../models/User");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { COINGECKO_API_KEY } = process.env;
if (!COINGECKO_API_KEY) {
    throw new Error("COINGECKO_API_KEY is not defined in the environment variables");
}
/** -----------------------------------------------------------------------------------------------
 * Fetches the current dollar (USD) price of a crypto coin from the CoinGecko API.
 *
 * @param {string} coinId string coin id of which to fetch the price for.
 * @returns {Promise<number|null>} coin's dollar (USD) value or null if an error occurs
 */
const fetchCoinPrice = (coinId) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `https://api.coingecko.com/api/v3/coins/${coinId}`;
    const options = {
        method: "GET",
        headers: {
            accept: "application/json",
            "x-cg-demo-api-key": COINGECKO_API_KEY,
        },
    };
    try {
        const response = yield fetch(url, options);
        const data = yield response.json();
        return data.market_data.current_price.usd;
    }
    catch (error) {
        console.error(`Failed to fetch coin price (for ${coinId}) from CoinGecko:`, error);
        return null;
    }
});
exports.fetchCoinPrice = fetchCoinPrice;
/** -----------------------------------------------------------------------------------------------
 * Finds the price of each coin held inside a user's portfolio and calculates the total value
 * of all holdings.
 *
 * @param userId string user id of which user to fetch details for.
 * @returns {Promise<number>} the total value of the user's portfolio at that current time.
 */
const fetchPortfolioValue = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // check if user exists
    const user = yield User_1.User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    const portfolio = user.portfolio;
    if (!portfolio) {
        return 0;
    }
    let totalValue = 0;
    for (const coin of portfolio) {
        const price = yield (0, exports.fetchCoinPrice)(coin.id);
        if (!price) {
            totalValue += 0;
        }
        totalValue += coin.amount * price;
    }
    return totalValue;
});
exports.fetchPortfolioValue = fetchPortfolioValue;
/** -----------------------------------------------------------------------------------------------
 * Adds an object to the portfolioValues array within the user's database, containing the
 * portfolio value and timestamp.
 *
 * @param userId string ID of the user whose portfolio value is to be added.
 * @param totalValue the total value of the user's portfolio.
 * @returns {Promise<void>} A promise that resolves when the value is added.
 */
const addPortfolioValue = (userId, totalValue) => __awaiter(void 0, void 0, void 0, function* () {
    // check if user exists
    const user = yield User_1.User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    try {
        // save portfolio value to mongodb
        user.portfolioValues.push({ value: totalValue, timestamp: Date.now() });
        yield user.save();
    }
    catch (err) {
        console.error("Failed to save portfolio value to db", err);
    }
});
exports.addPortfolioValue = addPortfolioValue;
