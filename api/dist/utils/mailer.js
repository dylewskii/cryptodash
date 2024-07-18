"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { EMAIL_USER, EMAIL_PASS } = process.env;
if (!EMAIL_USER || !EMAIL_PASS) {
    throw new Error("Email User/Email Pass have not been defined in the environment variables");
}
exports.transporter = nodemailer_1.default.createTransport({
    service: "Gmail",
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },
});
