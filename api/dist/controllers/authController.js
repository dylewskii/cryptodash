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
exports.checkAuth = exports.refreshToken = exports.resetPassword = exports.requestPasswordReset = exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const sendResetEmail_1 = require("../utils/sendResetEmail");
const jwtServices_1 = require("../services/jwtServices");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = process.env;
if (!JWT_ACCESS_SECRET || !JWT_REFRESH_SECRET) {
    throw new Error("JWT secrets are not defined in the environment variables");
}
// POST /register
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password, passwordConfirm } = req.body;
    try {
        // check all fields entered
        if (!email || !username || !password) {
            return res.status(400).json({ error: "All field are required" });
        }
        // check password is not less than 6 characters
        if (password.length < 6) {
            return res
                .status(400)
                .json({ error: "Password needs to be at least 6 characters long" });
        }
        // check if passwords match
        if (password !== passwordConfirm) {
            return res.status(400).json({ error: "Passwords do not match" });
        }
        // check if user already exists
        const existingUser = yield User_1.User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists." });
        }
        // hash password and save new user instance to DB
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newUser = new User_1.User({
            username,
            email,
            password: hashedPassword,
        });
        yield newUser.save();
        // gen JWT token for the new user
        const token = jsonwebtoken_1.default.sign({
            id: newUser._id.toString(),
            username: newUser.username,
            email: newUser.email,
        }, JWT_ACCESS_SECRET, { expiresIn: "1h" });
        // set token in a HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 3600000, // 1hr
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
        });
        res.json({
            msg: "User Registered Successfully",
            token: "Bearer " + token,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
            },
        });
    }
    catch (err) {
        console.error("Server error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.registerUser = registerUser;
// POST /login
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        // check if user exists
        const user = yield User_1.User.findOne({ username });
        if (!user) {
            return res.status(404).json({ msg: "User not found." });
        }
        // check if password valid
        const validPassword = yield bcryptjs_1.default.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ msg: "Incorrect Credentials" });
        }
        const { accessToken, refreshToken } = (0, jwtServices_1.generateTokens)(user);
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.json({
            success: true,
            msg: "login successful",
            accessToken,
            user: { id: user._id, username: user.username, email: user.email },
        });
    }
    catch (error) {
        return res.status(500).json({ msg: "Internal server error", err: error });
    }
});
exports.loginUser = loginUser;
// GET /logout
const logoutUser = (req, res) => {
    // check if token cookie exists - i.e user logged in
    if (!req.cookies["refreshToken"]) {
        return res.status(403).json({ msg: "User not logged in." });
    }
    // invalidate access & refresh tokens - set expiration to past date
    res.cookie("accessToken", "", { httpOnly: true, expires: new Date(0) });
    res.cookie("refreshToken", "", { httpOnly: true, expires: new Date(0) });
    res.status(200).json({ msg: "Logged out successfully" });
};
exports.logoutUser = logoutUser;
// POST /request-password-reset
const requestPasswordReset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        // check if user exists
        const user = yield User_1.User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, msg: "User not found." });
        }
        // gen a reset token
        const resetToken = jsonwebtoken_1.default.sign({ id: user._id.toString() }, JWT_ACCESS_SECRET, { expiresIn: "1h" });
        // send the reset token to the user's email
        yield (0, sendResetEmail_1.sendResetEmail)(email, resetToken);
        res.json({
            success: true,
            msg: "Password reset token sent to the provided email.",
            user: user,
        });
    }
    catch (err) {
        console.error("Server error:", err);
        return res
            .status(500)
            .json({ success: false, msg: "Internal server error" });
    }
});
exports.requestPasswordReset = requestPasswordReset;
// POST /reset-password
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { newPassword, newPasswordConfirmation, resetToken } = req.body;
    try {
        // verify token
        const decoded = jsonwebtoken_1.default.verify(resetToken, JWT_ACCESS_SECRET);
        if (typeof decoded === "string") {
            throw new Error("Invalid token");
        }
        const user = yield User_1.User.findById(decoded.id);
        if (!user) {
            return res
                .status(404)
                .json({ success: false, msg: "Invalid token or user not found." });
        }
        // check if new passwords match
        if (newPassword !== newPasswordConfirmation) {
            return res
                .status(400)
                .json({ success: false, msg: "Passwords must match." });
        }
        // check if new passwords meet length criteria
        if (newPassword.length < 6 || newPasswordConfirmation.length < 6) {
            return res.status(400).json({
                success: false,
                msg: "Passwords must be at least 6 characters long.",
            });
        }
        // hash new password
        const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
        user.password = hashedPassword;
        yield user.save();
        res.json({ success: true, msg: "Password has been reset successfully." });
    }
    catch (err) {
        console.error("Server error:", err);
        return res
            .status(500)
            .json({ success: false, msg: "Internal server error" });
    }
});
exports.resetPassword = resetPassword;
// POST /refresh-token
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        return res
            .status(401)
            .json({ success: false, message: "Refresh token not found" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, JWT_REFRESH_SECRET);
        if (typeof decoded === "string") {
            throw new Error("Invalid token");
        }
        const user = yield User_1.User.findById(decoded.id);
        if (!user) {
            return res
                .status(401)
                .json({ success: false, message: "User not found" });
        }
        const { accessToken, refreshToken: newRefreshToken } = (0, jwtServices_1.generateTokens)(user);
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.json({ success: true, accessToken });
    }
    catch (error) {
        return res
            .status(401)
            .json({ success: false, message: "Invalid refresh token" });
    }
});
exports.refreshToken = refreshToken;
// GET - /check-auth
const checkAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Access token is required" });
        }
        const decoded = jsonwebtoken_1.default.verify(token, JWT_ACCESS_SECRET);
        if (typeof decoded === "string") {
            throw new Error("Invalid token");
        }
        const user = yield User_1.User.findById(decoded.id);
        if (!user) {
            return res
                .status(401)
                .json({ success: false, message: "User not found" });
        }
        res.json({
            user: { _id: user._id, username: user.username, email: user.email },
        });
    }
    catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
});
exports.checkAuth = checkAuth;
