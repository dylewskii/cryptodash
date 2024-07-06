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
exports.isCoinIdValid = exports.isCoinNameValid = void 0;
/**
 * Validates if a coin exists within the CoinGecko API - returns true or false
 * @param {string} coinName string name of coin to validate
 * @returns {Promise<boolean>} a promise that resolves to true if coin exists or false otherwise
 */
const isCoinNameValid = (coinName) => __awaiter(void 0, void 0, void 0, function* () {
    const url = "https://api.coingecko.com/api/v3/coins/list";
    const options = {
        method: "GET",
        headers: {
            accept: "application/json",
            "x-cg-demo-api-key": process.env.COINGECKO_API_KEY,
        },
    };
    try {
        const response = yield fetch(url, options);
        const validCoins = yield response.json();
        return validCoins.some((coin) => coin.name.toLowerCase() === coinName.toLowerCase());
    }
    catch (error) {
        throw new Error("Failed to validate coin name");
    }
});
exports.isCoinNameValid = isCoinNameValid;
const isCoinIdValid = (coinId) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `https://api.coingecko.com/api/v3/coins/${coinId}`;
    const options = {
        method: "GET",
        headers: {
            accept: "application/json",
            "x-cg-demo-api-key": process.env.COINGECKO_API_KEY,
        },
    };
    try {
        const response = yield fetch(url, options);
        if (response.status !== 200) {
            return false;
        }
        return true;
    }
    catch (error) {
        throw new Error("Failed to validate coin name");
    }
});
exports.isCoinIdValid = isCoinIdValid;
