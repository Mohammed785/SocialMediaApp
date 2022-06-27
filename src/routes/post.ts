import { RequestHandler, Router } from "express";
import { resizeImage, uploader,prisma, StatusCodes } from "../utils";
import { unlinkSync } from "fs";
import { BadRequestError, ForbiddenError, NotFoundError } from "../errors";

export const postRouter = Router()


                    /* Post Section*/
const feed:RequestHandler = async(req,res)=>{}

const getPosts: RequestHandler = async (req, res) => {
    const {id,stDate,enDate} = req.query
    let posts;
    if(!id){
        throw new BadRequestError("Please Provide User id")
    }
    let queryObj:Record<string,any> = {
        authorId:(id==="self")?req.user?.id:parseInt(id as string),
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
    const post = await prisma.post.update({where:{id},data:{...req.body,edited:true}})
    return res.json({post})
};

                    /* Post Image Section*/
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

const getPostImage:RequestHandler = async (req,res)=>{
    const { id,postId } = req.query
    if(id){
        const img = await prisma.postImage.findUnique({where:{id:parseInt(id as string)}})
        return res.json({img})
    }else if(postId){
        const images = await prisma.postImage.findMany({where:{postId:parseInt(postId as string)}})
        return res.json(images)
    }
    throw new NotFoundError("No Post Images Found")
}

const createPostImage:RequestHandler = async (req,res)=>{
    const id = parseInt(req.params.id)
    const post = await prisma.post.findUnique({where:{id}})
    if(!post){
        throw new NotFoundError("Post Not Found")
    }
    if(post?.authorId!==req.user?.id){
        throw new ForbiddenError("You Cant Edit This Post")
    }
    if(!req.file){
        throw new BadRequestError("Please Provide An Image")
    }
    await resizeImage(req.file.path,req.file.filename,req.file.destination)
    const newImg = await prisma.postImage.create({data:{
        postId:id,
        image:req.file!.path,
        description:req.body.description
    }})
    return res.status(StatusCodes.CREATED).json({newImg});
}

const updatePostImage:RequestHandler = async (req,res)=>{
    const id = parseInt(req.params.id)
    const queryObj:Record<string,any> = {}
    const old = await prisma.postImage.findUnique({where:{id},include:{post:true}})
    if(!old){
        throw new NotFoundError("Post Image Not Found");
    }
    if(old.post.authorId!==req.user?.id){
        throw new ForbiddenError("You Cant Update This Post Image")
    }
    if(req.file){
        await resizeImage(req.file.path, req.file.filename, req.file.destination);
        queryObj['image'] = req.file.path;
        unlinkSync(old.image);
    }
    if(req.body.description){
        queryObj["description"] = req.body.description;
    }
    const newImg = await prisma.postImage.update({where:{id},data:queryObj})
    return res.status(StatusCodes.ACCEPTED).json({newImg})
}

const deletePostImage:RequestHandler = async (req,res)=>{
    const id = parseInt(req.params.id);
    const exists = await prisma.postImage.findUnique({ where: { id },include:{post:true} });
    if(!exists){
        throw new NotFoundError("Post Image Not Found")
    }
    if(exists.post.authorId!==req.user?.id){
        throw new ForbiddenError("You Cant Update This Post Image");
    }
    const postImage = await prisma.postImage.delete({where:{id}})
    unlinkSync(exists.image);
    return res.json({postImage})
}

                    /* Post Save Section */
const savePost:RequestHandler = async(req,res)=>{
    const id = parseInt(req.params.id)
    const post = await prisma.post.findUnique({where:{id}})
    if(!post){
        throw new NotFoundError("Post Not Found")
    }
    const saved = await prisma.savedPost.create({data:{
        userId:req.user!.id,
        postId:id
    }})
    return res.status(StatusCodes.CREATED).json({msg:"Post Saved",post:saved})
}

const unSavePost:RequestHandler = async(req,res)=>{
    const id = parseInt(req.params.id);
    const saved = await prisma.savedPost.findUnique({where:{
        postId_userId:{
            postId:id,
            userId:req.user!.id
        }
    }})
    if(!saved){
        throw new NotFoundError("You Did't save this post")
    }
    if(saved.userId!==req.user?.id){
        throw new ForbiddenError("You Can't UnSave This Post")
    }
    await prisma.savedPost.delete({where:{
        postId_userId:{
            postId:id,
            userId:req.user!.id
        }
    }})
    return res.json({msg:"Saved Post Deleted"})
}

                    /* Post Save Section */
const getPostReact:RequestHandler = async(req,res)=>{
    const id = parseInt(req.params.id);
    const reaction = await prisma.postReaction.findUnique({
        where: {
            postId_userId: {
                postId: id,
                userId: req.user!.id,
            },
        },
    });
    if(!reaction){
        throw new NotFoundError("No React For This Post Found")
    }
    return res.json({reaction})
}
const postReact:RequestHandler = async(req,res)=>{
    const id = parseInt(req.params.id)
    let reaction;
    const react = Boolean(req.query.react)
    const exists = await prisma.postReaction.findUnique({where:{
        postId_userId:{
            postId:id,
            userId:req.user!.id
        }
    }})
    if(!exists){
        reaction=await prisma.postReaction.create({data:{
            postId:id,
            userId:req.user!.id,
            reaction:react
        }})
    }else{
        if(exists.reaction!==react){
            reaction=await prisma.postReaction.update({where:{
                postId_userId:{
                postId:id,
                userId:req.user!.id
            }
            },data:{reaction:react}})
        }else{
            await prisma.postReaction.delete({where:{
                postId_userId:{
                postId:id,
                userId:req.user!.id
                }   
            }})
        }
    }
    return res.status(StatusCodes.CREATED).json({msg:`Post ${(react===true)?"Liked":"Disliked"}`,reaction})
}

// post react
postRouter.get("/:id/react",getPostReact)
postRouter.post("/:id/react",postReact)
// post save
postRouter.post("/:id/save",savePost)
postRouter.delete("/:id/unsave",unSavePost)

// post image
postRouter.get("/image",getPostImage)
postRouter.post("/:id/image/create",uploader.single("image"),createPostImage)
postRouter.patch("/image/update/:id",uploader.single("image"),updatePostImage)
postRouter.delete("/image/delete/:id",deletePostImage)

// post
postRouter.get("/",getPosts)
postRouter.get("/:id",getPost)
postRouter.post("/create",uploader.array("images"),createPost);
postRouter.patch("/update/:id",updatePost)
postRouter.delete("/delete/:id",deletePost)
