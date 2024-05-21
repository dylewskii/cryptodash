const express = require("express");
const router = express.Router();
const passport = require("passport");
const multer = require("multer");
const uploadController = require("../controllers/uploadController");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// POST -> upload a profile picture
router.post(
  "/profile-picture",
  passport.authenticate("jwt", { session: false }),
  upload.single("avatar"),
  uploadController.uploadProfilePic
);

// GET -> get presigned URL for user's profile picture
router.get(
  "/profile-picture-url",
  passport.authenticate("jwt", { session: false }),
  uploadController.getProfilePicUrl
);

module.exports = router;
