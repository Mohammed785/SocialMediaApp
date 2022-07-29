import { Router } from "express"
import {login,register,logout,forgetPassword,resetPassword,changePassword,updateProfile,deleteAccount} from "../controllers/auth"
import { CreateUserDTO, LoginDTO, ResetPasswordDTO } from "../@types/user";
import { authMiddleware, validationMiddleware } from "../middleware";

export const authRouter = Router();

authRouter.post("/login",validationMiddleware(LoginDTO),login)
authRouter.post("/register",validationMiddleware(CreateUserDTO),register)
authRouter.post("/logout",authMiddleware,logout)
authRouter.post("/forgetPassword",forgetPassword)
authRouter.post("/resetPassword/:token",validationMiddleware(ResetPasswordDTO),resetPassword)
authRouter.patch("/changePassword",authMiddleware,changePassword)
authRouter.patch("/account/update",authMiddleware,validationMiddleware(CreateUserDTO,true),updateProfile)
authRouter.delete("/account/delete",authMiddleware,deleteAccount)
