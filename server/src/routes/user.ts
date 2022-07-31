import { Router } from "express";
import {changeImg, userInfo,userSearch} from "../controllers/user"
import { uploader } from "../utils";

export const userRouter = Router()

userRouter.get("/",userInfo)
userRouter.get("/all",userSearch)
userRouter.patch("/img",uploader.single("image"),changeImg)