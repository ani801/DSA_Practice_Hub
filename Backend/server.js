import  dotenv  from "dotenv";
import express from "express";
import connectDB from "./src/config/db.js";
import cors from "cors";
import userRouter from "./src/routes/userRouter.js";
import cookieParser from "cookie-parser";
import dsaRouter from "./src/routes/dsaRouter.js";
import potdRouter from "./src/routes/potdRouter.js";
import { userAuth } from "./src/middlewares/userAuth.js";
import authRouter from "./src/routes/authRouter.js";

const app = express();
dotenv.config();
connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
    origin: https://dsa-practice-hub-frontend-0i71.onrender.com, 
    credentials: true, 
  }));
  


app.get("/", (req, res) => {
  res.send("API is running...");
});

// Generate CSRF token middleware
app.use("/api/user", userRouter);
app.use("/api/dsa",userAuth,dsaRouter);
app.use("/api/potd", userAuth, potdRouter);
app.use("/api/auth", authRouter);


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
