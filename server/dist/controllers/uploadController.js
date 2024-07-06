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
exports.getProfilePicUrl = exports.uploadProfilePic = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const sharp_1 = __importDefault(require("sharp"));
const User_1 = require("../models/User");
const generateRandomFileName_1 = require("../utils/generateRandomFileName");
const s3Services_1 = require("../services/s3Services");
dotenv_1.default.config();
// 3MB in bytes
const MAX_FILE_SIZE = 3 * 1024 * 1024;
// handles a profile picture upload
const uploadProfilePic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (!req.user) {
        return res.status(401).json({ success: false, msg: "No user found" });
    }
    const userId = req.user.id;
    // check if a file was uploaded / posted
    if (!file) {
        return res.status(400).json({ success: false, msg: "No file uploaded" });
    }
    // ensure file size is under 3MB (MAX_FILE_SIZE)
    if (file.size > MAX_FILE_SIZE) {
        return res
            .status(400)
            .json({ success: false, msg: "Image cannot exceed 3MB" });
    }
    // check if user exists
    const user = yield User_1.User.findById(userId);
    if (!user) {
        return res.status(404).json({ success: false, msg: "User not found" });
    }
    // delete existing profile pic if it exists
    if (user.profilePicture) {
        try {
            yield (0, s3Services_1.deleteFileFromS3)(user.profilePicture);
        }
        catch (err) {
            console.error("failed to delete existing profile pic from s3", err);
        }
    }
    try {
        const fileName = (0, generateRandomFileName_1.generateRandomFileName)();
        // resize & convert uploaded image to webp using sharp
        const buffer = yield (0, sharp_1.default)(file.buffer)
            .resize({
            height: 150,
            width: 150,
            fit: "cover",
        })
            .toFormat("webp")
            .toBuffer();
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: fileName,
            Body: buffer,
            ContentType: "image/webp",
        };
        yield (0, s3Services_1.uploadFileToS3)(params);
        // const s3Url = `https://${process.env.BUCKET_NAME}.s3.${process.env.BUCKET_REGION}.amazonaws.com/${fileName}`;
        // save file key in user document
        user.profilePicture = fileName;
        yield user.save();
        const presignedUrl = yield (0, s3Services_1.generatePresignedUrl)(fileName);
        console.log("uploaded!");
        res.status(200).json({
            success: true,
            msg: "Profile picture uploaded successfully",
            presignedUrl,
        });
    }
    catch (err) {
        console.error("Error uploading file to S3", err);
        res.status(500).json({ success: false, msg: "Error uploading file" });
    }
});
exports.uploadProfilePic = uploadProfilePic;
// fetches the presigned URL for the user's profile picture
const getProfilePicUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res
            .status(401)
            .json({ success: false, message: "User not authenticated" });
    }
    const userId = req.user.id;
    try {
        const user = yield User_1.User.findById(userId);
        if (!user || !user.profilePicture) {
            return res
                .status(404)
                .json({ success: false, msg: "Profile picture not found" });
        }
        // gen presigned URL for the profile picture
        const presignedUrl = yield (0, s3Services_1.generatePresignedUrl)(user.profilePicture);
        res.json({
            success: true,
            presignedUrl,
        });
    }
    catch (err) {
        console.error("Error generating presigned URL", err);
        res
            .status(500)
            .json({ success: false, msg: "Error generating presigned URL" });
    }
});
exports.getProfilePicUrl = getProfilePicUrl;
