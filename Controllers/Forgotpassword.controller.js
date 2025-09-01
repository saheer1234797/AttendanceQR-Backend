// Controllers/userController.js
import crypto from "crypto";
import nodemailer from "nodemailer";
import { User } from "../Models/User.model.js";

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email not found" });

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    // Send email
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetURL = `http://localhost:3001/reset-password/${resetToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      html: `<p>Click <a href="${resetURL}">here</a> to reset your password. Link expires in 15 minutes.</p>`
    });

    res.status(200).json({ message: "Password reset email sent" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
