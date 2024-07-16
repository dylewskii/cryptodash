import { Router } from "express";
import multer from "multer";
import {
  uploadProfilePic,
  getProfilePicUrl,
} from "../controllers/uploadController";
import { authenticateJWT } from "../strategies/passportJwt";

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// POST -> upload a profile picture
router.post(
  "/profile-picture",
  authenticateJWT,
  upload.single("avatar"),
  uploadProfilePic
);

// GET -> get presigned URL for user's profile picture
router.get("/profile-picture-url", authenticateJWT, getProfilePicUrl);

export default router;
