"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const uploadController_1 = require("../controllers/uploadController");
const passportJwt_1 = require("../strategies/passportJwt");
const router = (0, express_1.Router)();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
// POST -> upload a profile picture
router.post("/profile-picture", passportJwt_1.authenticateJWT, upload.single("avatar"), uploadController_1.uploadProfilePic);
// GET -> get presigned URL for user's profile picture
router.get("/profile-picture-url", passportJwt_1.authenticateJWT, uploadController_1.getProfilePicUrl);
exports.default = router;
