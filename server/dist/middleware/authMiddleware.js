"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { JWT_ACCESS_SECRET } = process.env;
if (!JWT_ACCESS_SECRET) {
    throw new Error("JWT access secret is not defined in the environment variables");
}
const verifyAccessToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    console.log(token);
    if (!token) {
        return res.status(401).json({ message: "Access token is required" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_ACCESS_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};
exports.verifyAccessToken = verifyAccessToken;
