"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
// POST -> register new user
router.post("/register", authController_1.registerUser);
// POST -> login user
router.post("/login", authController_1.loginUser);
// GET -> logout user
router.get("/logout", authController_1.logoutUser);
// POST -> reset password
router.post("/reset-password", authController_1.resetPassword);
// POST -> request a password reset link
router.post("/request-password-reset", authController_1.requestPasswordReset);
// POST -
router.post("/refresh-token", authController_1.refreshToken);
// GET - grabs token from headers & checks if user exists
router.get("/check-auth", authController_1.checkAuth);
exports.default = router;
