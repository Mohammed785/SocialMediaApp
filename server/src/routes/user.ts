import { Router } from "express";
import {userInfo,userSearch} from "../controllers/user"

export const userRouter = Router()

userRouter.get("/",userInfo)
userRouter.get("/all",userSearch)