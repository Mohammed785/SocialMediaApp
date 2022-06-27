import { RequestHandler, Router } from "express";
import { resizeImage, uploader,prisma, StatusCodes } from "../utils";
import { unlinkSync } from "fs";
import { BadRequestError, ForbiddenError, NotFoundError } from "../errors";

export const postRouter = Router()

const feed:RequestHandler = async(req,res)=>{}

const getPosts: RequestHandler = async (req, res) => {
    const {id,stDate,enDate} = req.query
    let posts;
    if(!id){
        throw new BadRequestError("Please Provide User id")
    }
    let queryObj:Record<string,any> = {
        id:(id==="self")?req.user?.id:parseInt(id as string),
        private:(id==="self")?{in:[true,false]}:false,
        createTime:{
            gte:(stDate)?new Date(stDate as string).toISOString():new Date(0).toISOString(),
            lte:(enDate)?new Date(enDate as string).toISOString():new Date().toISOString()
        }
    }
    posts = await prisma.post.findMany({where:queryObj,include:{images:true}})
    return res.json({posts})
};

const getPost:RequestHandler = async(req,res)=>{
    const id = parseInt(req.params.id)
    const post = await prisma.post.findUnique({where:{id}
    ,include:{images:true}})
    if(!post){
        throw new NotFoundError("Post Not Found")
    }
    if(post.authorId!==req.user?.id && post.private===true){
        throw new ForbiddenError("You Cant View This Post")
    }
    return res.status(StatusCodes.OK).json({post});
}

const createPost:RequestHandler = async(req,res)=>{
    const { body,captions } = req.body
    if(!req.files && !body){
        throw new BadRequestError("Cant Create Empty Post")
    }
    const post = await prisma.post.create({data:{body,authorId:req.user!.id}})
    if(req.files){
        (req.files as Array<Express.Multer.File>).forEach(async(file,idx)=>{
            await resizeImage(file.path,file.filename,file.destination)
            await prisma.postImage.create({data:{postId:post.id,image:file.path,
                description:captions[idx]}})
        })
    }
    return res.status(StatusCodes.CREATED).json({msg:"Post Created",post})
}
    
const updatePost: RequestHandler = async (req, res) => {
    const id = parseInt(req.params.id);
    const old = await prisma.post.findUnique({where:{id}})
    if(!old){
        throw new NotFoundError("Post Not Found")
    }
    if(old.authorId!==req.user?.id){
        throw new ForbiddenError("You Cant Update This Post")
    }
    const post = await prisma.post.update({where:{id},data:{body:req.body.body}})
    return res.json({post})
};


const deletePost:RequestHandler = async(req,res)=>{
    const id = parseInt(req.params.id);
    const post = await prisma.post.findUnique({where:{id},include:{images:true}})
    if(!post){
        throw new NotFoundError("Post Not Found")
    }
    if(post.authorId!==req.user?.id){
        throw new ForbiddenError("You Cant Delete This Post")
    }
    await prisma.post.delete({where:{id}})
    post.images.forEach((img)=>{
        unlinkSync(img.image);
    })
    return res.status(StatusCodes.OK).json({post})
}


// post
postRouter.get("/",getPosts)
postRouter.get("/:id",getPost)
postRouter.post("/create",uploader.array("images"),createPost);
postRouter.patch("/update/:id",updatePost)
postRouter.delete("/delete/:id",deletePost)
