import crypto from "crypto";
import User from "../models/userModel.js";
import sendEmail from "../config/sendEmail.js";
import bcrypt from "bcryptjs";

const requestOtp = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

  user.otpCode = crypto.createHash("sha256").update(otp).digest("hex");
  user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes

  await user.save({ validateBeforeSave: false });

  const html = `
    <p>Your OTP for password reset is:</p>
    <h2>${otp}</h2>
    <p>This OTP is valid for 5 minutes.</p>
  `;

  try {
    await sendEmail(user.email, "🔐 Your OTP for Password Reset", html);
    res.json({ success: true, message: "OTP sent to your email" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};


const verifyOtp = async (req, res) => {
  
  const { email, otp } = req.body;
  try {
  if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    } 
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  if (!user.otpCode || !user.otpExpires) {
    return res.status(400).json({ success: false, message: "No OTP requested" });
  }

  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

  if (hashedOtp !== user.otpCode || Date.now() > user.otpExpires)
    return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
  user.otpCode = undefined; // Clear OTP
  user.otpExpires = undefined; // Clear expiration
  await user.save({ validateBeforeSave: false });

  // Mark session verified (or send token)
  res.json({ success: true, message: "OTP verified" });
} catch (error) {
  console.error("OTP verification error:", error);
  res.status(500).json({ success: false, message: "Internal server error" });   
}
};


const resetPasswordWithOtp = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
  if (!email || !newPassword) { 
    return res.status(400).json({ success: false, message: "Email and new password are required" });
  }
  if( newPassword.length < 6) {
    return res.status(400).json({ success: false, message: "Password must be at least 6 characters long" });
  }
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.json({ success: true, message: "Password reset successfully" });
} catch (error) {
  console.error("Password reset error:", error);
  res.status(500).json({ success: false, message: "Internal server error" });
}
};



export { requestOtp, verifyOtp, resetPasswordWithOtp };