import { Router } from "express";
import {
    getPost,getGroupPosts,getPostImage,getPostReact,getPostReactions,getPosts,getSavedPosts,savePost
    ,unSavePost,updatePost,createPost,createPostImage,postReact,deletePost,deletePostImage,feed} from "../controllers/post"
import { uploader } from "../utils";
import { validationMiddleware } from "../middleware";
import { UpdatePostDTO } from "../@types/post";

export const postRouter = Router()

// post react
postRouter.get("/:id/reacts",getPostReactions)
postRouter.get("/:id/react",getPostReact)
postRouter.post("/:id/react",postReact)
// post save
postRouter.get("/saved",getSavedPosts)
postRouter.post("/:id/save",savePost)
postRouter.delete("/:id/unsave",unSavePost)

// post image
postRouter.get("/image",getPostImage)
postRouter.post("/:id/image/create",uploader.single("image"),createPostImage)
postRouter.delete("/image/delete/:id",deletePostImage)

// post
postRouter.get("/feed",feed)
postRouter.get("/",getPosts)
postRouter.get("/:id",getPost)
postRouter.get("/group/:id",getGroupPosts)
postRouter.post("/create",uploader.array("images"),createPost);
postRouter.patch("/update/:id",validationMiddleware(UpdatePostDTO,true),updatePost)
postRouter.delete("/delete/:id",deletePost)
