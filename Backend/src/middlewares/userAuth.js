import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";


// Middleware to authenticate user using JWT
const userAuth = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({success:false ,message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    console.log("auth error",error)
    return res.status(401).json({success:false, message: "Not authorized, token failed" });
  }
});


// const isTokenValid = asyncHandler(async (req, res, next) => {
//   const token = req.cookies.token;
//  try {
//   if (!token) {
//     return res.status(401).json({success:false ,message: "Not authorized, no token" });
//   }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user= await User.findById(decoded.id).select("-password");
//     if(!user) {
//       return res.status(401).json({success:false, message: "Not authorized, user not found" });
//     }
//     return res.status(200).json({success:true, user});
//   } catch (error) {
//   
//     return res.status(401).json({success:false, message: "Not authorized, token failed" });
//   }
// });



const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
  res.status(200).json({ success: true, message: "User logged out successfully" });
} );

export { userAuth, logoutUser };