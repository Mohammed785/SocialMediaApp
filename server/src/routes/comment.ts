import { Router } from "express";
import {getPostComments,getSubComments,createComment,updateComment,deleteComment,commentReact} from "../controllers/comment"

export const commentRouter = Router()

commentRouter.get("/post/:id",getPostComments)
commentRouter.get("/:id/sub",getSubComments)
commentRouter.post("/create/:id",createComment)
commentRouter.patch("/update/:id",updateComment)
commentRouter.delete("/delete/:id",deleteComment)
commentRouter.post("/:id/react",commentReact)
