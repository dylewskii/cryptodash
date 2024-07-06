import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const { EMAIL_USER, EMAIL_PASS } = process.env;

export const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});
