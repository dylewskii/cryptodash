import { transporter } from "./mailer";

export const sendResetEmail = async (email: string, token: string) => {
  const resetLink = `http://localhost:5173/reset-password?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset",
    html: `<p>To reset your password, please click <a href="${resetLink}">this link</a>. If you don't want to reset your password you can ignore this message.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending password reset email:", error);
  }
};
