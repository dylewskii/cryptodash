const User = require("../models/User");
const generateRandomFileName = require("../utils/generateRandomFileName");
const {
  generatePresignedUrl,
  uploadFileToS3,
} = require("../services/s3Service");
require("dotenv").config();

// handles a profile picture upload
const uploadProfilePic = async (req, res) => {
  const file = req.file;
  const userId = req.user.id;

  if (!file) {
    return res.status(400).json({ success: false, msg: "No file uploaded" });
  }

  const fileName = generateRandomFileName();
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    await uploadFileToS3(params);

    // const s3Url = `https://${process.env.BUCKET_NAME}.s3.${process.env.BUCKET_REGION}.amazonaws.com/${fileName}`;

    // check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

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
