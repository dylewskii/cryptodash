const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/register", authController.registerUser);

router.post("/login", authController.loginUser);

router.get("/profile", authController.getProfile);

module.exports = router;
