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
exports.fetchSearchResults = exports.fetchAllCoinsWithMarketDataRecursive = exports.fetchAllCoinsWithMarketDataPaginated = exports.fetchAllCoins = exports.fetchTotalMcapData = exports.fetchPortfolioCoinData = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { COINGECKO_API_KEY } = process.env;
if (!COINGECKO_API_KEY) {
    throw new Error("CG API key is not defined in the environment variables");
}
// fetches data for a given coin - coinId is supplied through a query param
const fetchPortfolioCoinData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // extract the coin query param
    const coinId = req.query.coin;
    if (!coinId) {
        return res
            .status(400)
            .json({ success: false, message: "No coin specified" });
    }
    const url = `https://api.coingecko.com/api/v3/coins/${coinId}`;
    const queryParams = `?sparkline=true`;
    const options = {
        method: "GET",
        headers: {
            accept: "application/json",
            "x-cg-demo-api-key": COINGECKO_API_KEY,
        },
    };
    try {
        const response = yield fetch(`${url}${queryParams}`, options);
        const data = yield response.json();
        res.status(200).json({
            success: true,
            data: data,
        });
    }
    catch (error) {
        console.error(`Error fetching coin data (for ${coinId}) from CoinGecko:`, error);
    }
});
exports.fetchPortfolioCoinData = fetchPortfolioCoinData;
// fetches the total crypto market cap data
const fetchTotalMcapData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const url = "https://api.coingecko.com/api/v3/global";
    const options = {
        method: "GET",
        headers: {
            Accept: "application/json",
            "x-cg-demo-api-key": COINGECKO_API_KEY,
        },
    };
    try {
        const response = yield fetch(url, options);
        const data = yield response.json();
        res.status(200).json({
            success: true,
            data: data.data.total_market_cap,
        });
    }
    catch (err) {
        console.error("Failed to retrieve total mcap data:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});
exports.fetchTotalMcapData = fetchTotalMcapData;
// fetches all coins from CG - with no market data (name, id, symbol)
const fetchAllCoins = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const url = "https://api.coingecko.com/api/v3/coins/list";
    const options = {
        method: "GET",
        headers: {
            Accept: "application/json",
            "x-cg-demo-api-key": COINGECKO_API_KEY,
        },
    };
    try {
        const response = yield fetch(url, options);
        const data = yield response.json();
        res
            .status(200)
            .json({ success: true, msg: "Retrieved all coins successfully", data });
    }
    catch (error) {
        console.error("Error fetching coin list from CG:", error);
        throw new Error("Failed to fetch coin list from CG");
    }
});
exports.fetchAllCoins = fetchAllCoins;
// paginated fetch - page nr is supplied through a query param
const fetchAllCoinsWithMarketDataPaginated = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1 } = req.query;
    const url = `https://api.coingecko.com/api/v3/coins/markets`;
    const queryParams = `?vs_currency=usd&order=market_cap_desc&sparkline=true&page=${page}`;
    const options = {
        method: "GET",
        headers: {
            accept: "application/json",
            "x-cg-demo-api-key": COINGECKO_API_KEY,
        },
    };
    try {
        const response = yield fetch(`${url}${queryParams}`, options);
        const data = yield response.json();
        res.status(200).json({
            success: true,
            data,
        });
    }
    catch (err) {
        res.status(500).json({ success: false, msg: err.message });
        throw new Error("Failed to fetch coin list w/ market data from CG");
    }
});
exports.fetchAllCoinsWithMarketDataPaginated = fetchAllCoinsWithMarketDataPaginated;
// recursive fetch - returns all coins from CG w/ market data
const fetchAllCoinsWithMarketDataRecursive = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const paginatedFetch = (url_1, ...args_1) => __awaiter(void 0, [url_1, ...args_1], void 0, function* (url, page = 1, previousResponse = []) {
        try {
            const response = yield fetch(`${url}&page=${page}`, {
                method: "GET",
                headers: {
                    accept: "application/json",
                    "x-cg-demo-api-key": COINGECKO_API_KEY,
                },
            });
            const newResponse = yield response.json();
            const combinedResponse = [...previousResponse, ...newResponse];
            if (newResponse.length !== 0) {
                return paginatedFetch(url, page + 1, combinedResponse);
            }
            return combinedResponse;
        }
        catch (err) {
            console.error("Failed to fetch paginated data:", err);
            throw new Error("Failed to fetch paginated data");
        }
    });
    const baseUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250`;
    try {
        const allCoins = yield paginatedFetch(baseUrl);
        res.status(200).json({
            success: true,
            data: allCoins,
        });
    }
    catch (err) {
        res.status(500).json({ success: false, msg: err.message });
        console.error("Failed to fetch coin list with market data from CG:", err);
    }
});
exports.fetchAllCoinsWithMarketDataRecursive = fetchAllCoinsWithMarketDataRecursive;
// fetches all coins under the provided search term - supplied through a query param
const fetchSearchResults = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const searchTerm = req.query.searchTerm;
    if (!searchTerm) {
        return res
            .status(400)
            .json({ success: false, msg: "Search query param is missing" });
    }
    const url = `https://api.coingecko.com/api/v3/search?query=${searchTerm}`;
    const options = {
        method: "GET",
        headers: {
            accept: "application/json",
            "x-cg-demo-api-key": COINGECKO_API_KEY,
        },
    };
    try {
        const response = yield fetch(url, options);
        if (!response.ok) {
            throw new Error(`Http Error: ${response.status}`);
        }
        const data = yield response.json();
        return res.json({ data });
    }
    catch (err) {
        console.error("Error fetching results for provided search query :", err);
        return res
            .status(500)
            .json({ success: false, msg: "Failed to run search" });
    }
});
exports.fetchSearchResults = fetchSearchResults;
