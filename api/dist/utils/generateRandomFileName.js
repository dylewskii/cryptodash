"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomFileName = void 0;
const crypto_1 = __importDefault(require("crypto"));
/**
 * Generates a random file name using crypto random bytes
 * @param {number} bytes - Nr of bytes to generate for the file name - default is 32
 * @returns {string} - A random hexadecimal string
 */
const generateRandomFileName = (bytes = 32) => {
    return crypto_1.default.randomBytes(bytes).toString("hex");
};
exports.generateRandomFileName = generateRandomFileName;
