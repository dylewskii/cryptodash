const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const passport = require("passport");

router.post("/register", authController.registerUser);

router.post("/login", authController.loginUser);

router.get("/logout", authController.logoutUser);

router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  authController.getProfile
);

module.exports = router;
