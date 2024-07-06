const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, username: user.username, email: user.email },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "15m" }
  );
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
  return { accessToken, refreshToken };
};

module.exports = {
  generateTokens,
};
