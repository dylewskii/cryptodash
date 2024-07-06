import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  resetPassword,
  requestPasswordReset,
  refreshToken,
  checkAuth,
} from "../controllers/authController";
const router = Router();

// POST -> register new user
router.post("/register", registerUser);

// POST -> login user
router.post("/login", loginUser);

// GET -> logout user
router.get("/logout", logoutUser);

// POST -> reset password
router.post("/reset-password", resetPassword);

// POST -> request a password reset link
router.post("/request-password-reset", requestPasswordReset);

// POST -
router.post("/refresh-token", refreshToken);

// GET - grabs token from headers & checks if user exists
router.get("/check-auth", checkAuth);

export default router;
