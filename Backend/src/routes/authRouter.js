import express from "express";
import { requestOtp,verifyOtp,resetPasswordWithOtp } from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/request-otp", requestOtp);
authRouter.post("/verify-otp", verifyOtp);
authRouter.post("/reset-password", resetPasswordWithOtp);

export default authRouter;
