const bcryptjs = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // check all fields entered
    if (!email || !username || !password) {
      return res.status(400).json({ error: "All field are required" });
    }
    // check password length
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password needs to be at least 6 characters long" });
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
    return res.json({ msg: "User Registered Succesfully" });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Internal server error" });
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
      return res.status(401).json({ msg: "Incorrect Credentials" });
    }

    const token = jwt.sign(
      { id: user._id.toString(), username: user.username },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });
    res.json({
      status: true,
      msg: "login successful",
      user: { id: user._id, username: user.username },
    });
  } catch (error) {
    return res.status(500).json({ msg: "Internal server error" });
  }
};

const getProfile = (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, process.env.JWT_KEY, {}, (err, user) => {
      if (err) {
        res.status(500).json({ msg: "Failed to verify token." });
        return;
      }

      res.json(user);
    });
  } else {
    res.status(401).json(null);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
};
