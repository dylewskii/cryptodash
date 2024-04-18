const bcryptjs = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists." });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    return res.json({ msg: "User Registered Succesfully" });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ msg: "User not found." });
    }

    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return res.json({ msg: "Incorrect Credentials" });
    }

    const token = jwt.sign({ username: user.username }, process.env.JWT_KEY, {
      expiresIn: "1h",
    });

    res.cookie("token", token), { httpOnly: true, maxAge: "3600000" };
    return res.json({ status: true, msg: "login succesfull" });
  } catch (error) {
    return res.status(500).json({ msg: "Internal server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
