require("dotenv").config();
const sharp = require("sharp");
const User = require("../models/User");
const generateRandomFileName = require("../utils/generateRandomFileName");
const {
  generatePresignedUrl,
  uploadFileToS3,
  deleteFileFromS3,
} = require("../services/s3Services");

// 3MB in bytes
const MAX_FILE_SIZE = 3 * 1024 * 1024;

// handles a profile picture upload
const uploadProfilePic = async (req, res) => {
  const file = req.file;
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
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ success: false, msg: "User not found" });
  }

  // delete existing profile pic if it exists
  if (user.profilePicture) {
    try {
      await deleteFileFromS3(user.profilePicture);
    } catch (err) {
      console.error("failed to delete existing profile pic from s3", err);
    }
  }

  try {
    const fileName = generateRandomFileName();

    // resize & convert uploaded image to webp using sharp
    const buffer = await sharp(file.buffer)
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

    await uploadFileToS3(params);

    // const s3Url = `https://${process.env.BUCKET_NAME}.s3.${process.env.BUCKET_REGION}.amazonaws.com/${fileName}`;

    // save file key in user document
    user.profilePicture = fileName;
    await user.save();

    const presignedUrl = await generatePresignedUrl(fileName);

    console.log("uploaded!");
    res.status(200).json({
      success: true,
      msg: "Profile picture uploaded successfully",
      presignedUrl,
    });
  } catch (err) {
    console.error("Error uploading file to S3", err);
    res.status(500).json({ success: false, msg: "Error uploading file" });
  }
};

// fetches the presigned URL for the user's profile picture
const getProfilePicUrl = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user || !user.profilePicture) {
      return res
        .status(404)
        .json({ success: false, msg: "Profile picture not found" });
    }

    // gen presigned URL for the profile picture
    const presignedUrl = await generatePresignedUrl(user.profilePicture);

    res.json({
      success: true,
      presignedUrl,
    });
  } catch (err) {
    console.error("Error generating presigned URL", err);
    res
      .status(500)
      .json({ success: false, msg: "Error generating presigned URL" });
  }
};

module.exports = {
  uploadProfilePic,
  getProfilePicUrl,
};
