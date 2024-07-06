const express = require("express");
const router = express.Router();
const multer = require("multer");
const uploadController = require("../controllers/uploadController");
const { authenticateJWT } = require("../strategies/passportJwt");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// POST -> upload a profile picture
router.post(
  "/profile-picture",
  authenticateJWT,
  upload.single("avatar"),
  uploadController.uploadProfilePic
);

// GET -> get presigned URL for user's profile picture
router.get(
  "/profile-picture-url",
  authenticateJWT,
  uploadController.getProfilePicUrl
);

module.exports = router;
