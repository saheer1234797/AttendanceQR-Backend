
import bcrypt from "bcryptjs";
import { User } from "../Models/User.model.js";

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  console.log("RESET API HIT", token, password);

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    // Hash new password
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(password, salt);

    // Clear token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
