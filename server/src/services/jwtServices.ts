import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = process.env;

if (!JWT_ACCESS_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error(
    "JWT access/refresh secrets are not defined in the environment variables"
  );
}

export const generateTokens = (user: any) => {
  const accessToken = jwt.sign(
    { id: user._id, username: user.username, email: user.email },
    JWT_ACCESS_SECRET,
    { expiresIn: "15m" }
  );
  const refreshToken = jwt.sign({ id: user._id }, JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};
