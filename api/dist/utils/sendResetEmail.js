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
exports.sendResetEmail = void 0;
const mailer_1 = require("./mailer");
const ORIGIN_URL = process.env.ORIGIN_URL || "http://localhost:5173";
const sendResetEmail = (email, token) => __awaiter(void 0, void 0, void 0, function* () {
    const resetLink = `${ORIGIN_URL}/reset-password?token=${token}`;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset",
        html: `<p>To reset your password, please click <a href="${resetLink}">this link</a>. If you don't want to reset your password you can ignore this message.</p>`,
    };
    try {
        yield mailer_1.transporter.sendMail(mailOptions);
    }
    catch (error) {
        console.error("Error sending password reset email:", error);
    }
});
exports.sendResetEmail = sendResetEmail;
