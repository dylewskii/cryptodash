const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const passport = require("passport");

// GET -> check if user is authenticated
router.get(
  "/check-auth",
  passport.authenticate("jwt", { session: false }),
  authController.checkAuth
);

// POST -> register new user
router.post("/register", authController.registerUser);

// POST -> login user
router.post("/login", authController.loginUser);

// GET -> logout user
router.get("/logout", authController.logoutUser);

// POST -> reset password
router.post("/reset-password", authController.resetPassword);

// POST -> request a password reset link
router.post("/request-password-reset", authController.requestPasswordReset);

module.exports = router;
