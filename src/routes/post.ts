import { RequestHandler, Router } from "express";
import { resizeImage, uploader,prisma, StatusCodes } from "../utils";
import { authMiddleware } from "../middleware/authMiddleware";
import { unlinkSync } from "fs";
import { BadRequestError, NotAuthenticatedError, NotFoundError } from "../errors";

export const postRouter = Router()

const feed:RequestHandler = async(req,res)=>{}

const getPosts: RequestHandler = async (req, res) => {};

const getPost:RequestHandler = async(req,res)=>{
    const id = parseInt(req.params.id)
    const post = await prisma.post.findUnique({where:{id}
    ,select:{body:true,images:true}})
    if(!post){
        throw new NotFoundError("Post Not Found")
    }
    return res.status(StatusCodes.OK).json({post});
}

const createPost:RequestHandler = async(req,res)=>{
    const { body,captions } = req.body
    if(!req.files && !body){
        throw new BadRequestError("Cant Create Empty Post")
    }
    const post = await prisma.post.create({data:{body,authorId:req.user?.id}})
    if(req.files){
        (req.files as Array<Express.Multer.File>).forEach(async(file,idx)=>{
            await resizeImage(file.path,file.filename,file.destination)
            await prisma.postImage.create({data:{postId:post.id,image:file.path,
                description:captions[idx]}})
        })
    }
    return res.status(StatusCodes.CREATED).json({msg:"Post Created",post})
}
    

const updatePost: RequestHandler = async (req, res) => {};

const deletePost:RequestHandler = async(req,res)=>{
    const id = parseInt(req.params.id);
    const post = await prisma.post.findFirst({where:{id},include:{images:true}})
    if(!post){
        throw new NotFoundError("Post Not Found")
    }
    if(post.authorId!==req.user?.id){
        throw new NotAuthenticatedError("You Cant Delete This Post")
    }
    await prisma.post.delete({where:{id}})
    post.images.forEach((img)=>{
        unlinkSync(img.image);
    })
    return res.status(StatusCodes.OK).json({post})
}

postRouter.get("/:id",authMiddleware,getPost)
postRouter.post("/create",authMiddleware,uploader.array("photos"),createPost);
postRouter.delete("/delete/:id",authMiddleware,deletePost)