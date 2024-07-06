const bcryptjs = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const sendResetEmail = require("../utils/sendResetEmail");
const { generateTokens } = require("../services/jwtServices");
require("dotenv").config();

// POST /register
const registerUser = async (req, res) => {
  const { username, email, password, passwordConfirm } = req.body;

  try {
    // check all fields entered
    if (!email || !username || !password) {
      return res.status(400).json({ error: "All field are required" });
    }

    // check password is not less than 6 characters
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password needs to be at least 6 characters long" });
    }

    // check if passwords match
    if (password !== passwordConfirm) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists." });
    }

    // hash password and save new user instance to DB
    const hashedPassword = await bcryptjs.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // gen JWT token for the new user
    const token = jwt.sign(
      {
        id: newUser._id.toString(),
        username: newUser.username,
        email: newUser.email,
      },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    // set token in a HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3600000,
      sameSite: "Strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.json({
      msg: "User Registered Successfully",
      token: "Bearer " + token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// POST /login
const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    // check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ msg: "User not found." });
    }

    // check if password valid
    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ msg: "Incorrect Credentials" });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      success: true,
      msg: "login successful",
      accessToken,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    return res.status(500).json({ msg: "Internal server error", err: error });
  }
};

// GET /logout
const logoutUser = (req, res) => {
  // check if token cookie exists - i.e user logged in
  if (!req.cookies["token"]) {
    return res.status(403).json({ msg: "User not logged in." });
  }

  // invalidate cookie - set expiration to past date
  res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ msg: "Logged out successfully" });
};

// POST /request-password-reset
const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    // check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found." });
    }

    // gen a reset token
    const resetToken = jwt.sign(
      { id: user._id.toString() },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    // send the reset token to the user's email
    await sendResetEmail(email, resetToken);

    res.json({
      success: true,
      msg: "Password reset token sent to the provided email.",
      user: user,
    });
  } catch (err) {
    console.error("Server error:", err);
    return res
      .status(500)
      .json({ success: false, msg: "Internal server error" });
  }
};

// POST /reset-password
const resetPassword = async (req, res) => {
  const { newPassword, newPasswordConfirmation, resetToken } = req.body;

  try {
    // verify token
    const decoded = jwt.verify(resetToken, process.env.JWT_KEY);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, msg: "Invalid token or user not found." });
    }

    // check if new passwords match
    if (newPassword !== newPasswordConfirmation) {
      return res
        .status(400)
        .json({ success: false, msg: "Passwords must match." });
    }

    // check if new passwords meet length criteria
    if (newPassword.length < 6 || newPasswordConfirmation.length < 6) {
      return res.status(400).json({
        success: false,
        msg: "Passwords must be at least 6 characters long.",
      });
    }

    // hash new password
    const hashedPassword = await bcryptjs.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ success: true, msg: "Password has been reset successfully." });
  } catch (err) {
    console.error("Server error:", err);
    return res
      .status(500)
      .json({ success: false, msg: "Internal server error" });
  }
};

// POST /refresh-token
const refreshToken = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res
      .status(401)
      .json({ success: false, message: "Refresh token not found" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({ success: true, accessToken });
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid refresh token" });
  }
};

// GET - /check-auth
const checkAuth = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }
    res.json({
      user: { _id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  requestPasswordReset,
  resetPassword,
  refreshToken,
  checkAuth,
};
