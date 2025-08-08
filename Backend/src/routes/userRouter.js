import express from "express";
import { userRegister,userLogin,userMe ,userLogout,userUpdate,findUserName} from "../controllers/userController.js";
import { userAuth } from "../middlewares/userAuth.js";



const userRouter = express.Router();

userRouter.post("/login",userLogin)
userRouter.post("/register",userRegister);
userRouter.get("/me",userMe)
userRouter.get("/logout",userLogout)
userRouter.put("/update/",userAuth,userUpdate);
userRouter.get("/check-username/:username",findUserName)



export default userRouter;