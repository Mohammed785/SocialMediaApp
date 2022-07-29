import { Router } from "express";
import { getNotifications,markAsRead } from "../controllers/notifications";

export const notificationRouter = Router()

notificationRouter.get("/",getNotifications)
notificationRouter.patch("/seen",markAsRead)