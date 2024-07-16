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
const node_cron_1 = __importDefault(require("node-cron"));
const User_1 = require("../models/User");
const portfolioServices_1 = require("../services/portfolioServices");
node_cron_1.default.schedule("0 * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.User.find();
        for (const user of users) {
            const userPortfolioValue = yield (0, portfolioServices_1.fetchPortfolioValue)(user._id);
            yield (0, portfolioServices_1.addPortfolioValue)(user._id, userPortfolioValue);
        }
    }
    catch (err) {
        console.error("Error in portfolio value save cron job:", err);
    }
}));
