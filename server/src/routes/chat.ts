import { Router } from "express";
import { createMsg, getChats, getMessages } from "../controllers/chat";

export const chatRouter = Router()

chatRouter.get("/all",getChats)
chatRouter.get("/:id/messages",getMessages)
chatRouter.post("/:id/message/create",createMsg)