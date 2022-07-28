import { RequestHandler, Router } from "express";
import { resizeImage, uploader,prisma, StatusCodes,userSelect, createNotification,unlinkImage } from "../utils";
import { BadRequestError, ForbiddenError, NotFoundError } from "../errors";
import { validationMiddleware } from "../middleware";
import { UpdatePostDTO } from "../@types/post";
import { join } from "path";
export const postRouter = Router()

                    /* Post Section*/
const feed:RequestHandler = async(req,res)=>{}

const getPosts: RequestHandler = async (req, res) => {
    const {stDate,enDate} = req.query
    let id=parseInt(req.query.id as string) || req.user!.id;
    let cursor = parseInt(req.query.cursor as string)
    const privateQuery = (id===req.user!.id)?{OR:[{private:true},{private:false}]}:{private:false}
    const cursorOptions:Record<string,any> = {cursor:undefined,skip:undefined}
    if(cursor){
        cursorOptions.cursor = {id:cursor}
        cursorOptions.skip = 1
    }
    const queryObj:Record<string,any> = {
        authorId:id,
        groupId:null,
        ...privateQuery,
        createTime:{
            gte:(stDate)?new Date(stDate as string).toISOString():new Date(0).toISOString(),
            lte:(enDate)?new Date(enDate as string).toISOString():new Date().toISOString()
        }
    }
    const posts = await prisma.post.findMany({
        take:3,
        ...cursorOptions,
        where:{...queryObj},
        include:{images:true,
            author:{select:{...userSelect}},
            reactions:{select:{reaction:true,user:{select:userSelect}}},
            _count:{select:{comments:true}}
        },
        orderBy:{id:"desc"}
    })
    const last = posts[posts.length - 1];
    cursor = last && posts.length >= 3 ? last.id : 0;
    return res.json({posts,cursor})
};

const getGroupPosts:RequestHandler = async(req,res)=>{
    const groupId = parseInt(req.params.id)
    let cursor = parseInt(req.query.cursor as string)
    const cursorOptions:Record<string,any> = {cursor:undefined,skip:undefined}
    if (cursor) {
        cursorOptions.cursor = { id: cursor };
        cursorOptions.skip = 1;
    }
    const posts = await prisma.post.findMany({
        where:{groupId},
        take:3,
        ...cursorOptions,
        include:{images:true,
            author:{select:{...userSelect}},
            reactions:{select:{reaction:true,user:{select:userSelect}}},
            _count:{select:{comments:true}}
        },
    })
    const last = posts[posts.length - 1];
    cursor = last && posts.length >= 3 ? last.id : 0;
    return res.json({posts,cursor})
}

const getPost:RequestHandler = async(req,res)=>{
    const id = parseInt(req.params.id)
    const post = await prisma.post.findUnique({where:{id}
    ,include:{images:true,reactions:true,author:{select:{...userSelect}}}})
    if(!post){
        throw new NotFoundError("Post Not Found")
    }
    const blocked = await prisma.relation.findFirst({
        where: {
            OR: [
                { userId: post.authorId, relatedId: req.user?.id },
                { userId: req.user?.id, relatedId: post.authorId }]},
    });
    if (blocked) {
        throw new ForbiddenError("You View This Post");
    }
    if(post.authorId!==req.user?.id && post.private===true){
        throw new ForbiddenError("You Cant View This Post")
    }
    return res.status(StatusCodes.OK).json({post});
}

const createPost:RequestHandler = async(req,res)=>{
    const groupId = parseInt(req.query.group as string)
    const { body, captions, isPrivate, commentable } = req.body;
    if(!req.files && !body){
        throw new BadRequestError("Cant Create Empty Post")
    }
    const post = await prisma.post.create({
        data: {
            body,
            authorId: req.user!.id,
            private: isPrivate === "true" ? true : false,
            commentable: commentable === "true" ? true : false,
            groupId:groupId?groupId:null
        },
    });
    if(req.files){
        (req.files as Array<Express.Multer.File>).forEach(async(file,idx)=>{
            await resizeImage(file.path,file.filename,file.destination)
            await prisma.postImage.create({data:{postId:post.id,image:file.filename,
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
        unlinkImage(img.image);
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
    const newImg = await prisma.postImage.create({
        data: {
            postId: id,
            image: req.file.filename,
            description: req.body.description,
        },
    });
    return res.status(StatusCodes.CREATED).json({newImg});
}

const deletePostImage:RequestHandler = async (req,res)=>{
    const id = parseInt(req.params.id);
    const exists = await prisma.postImage.findUnique({ where: { id },include:{post:true} });
    if(!exists){
        throw new NotFoundError("Post Image Not Found")
    }
    if(exists.post.authorId!==req.user?.id){
        throw new ForbiddenError("You Cant Delete This Post Image");
    }
    const postImage = await prisma.postImage.delete({where:{id}})
    unlinkImage(postImage.image);
    return res.json({postImage})
}

                    /* Post Save Section */
const getSavedPosts:RequestHandler = async(req,res)=>{
    let cursor = parseInt(req.query.cursor as string);
    const cursorOptions:Record<string,any> = {cursor:undefined,skip:undefined}
    if (cursor) {
        cursorOptions.cursor = { postId_userId:{postId:cursor,userId:req.user!.id}};
        cursorOptions.skip = 1;
    }
    const saved = await prisma.savedPost.findMany({
        take: 3,
        ...cursorOptions,
        where: { userId: req.user!.id },
        include: { post: { include: { author: { select: userSelect },images:true } } },
        orderBy: { postId: "desc" }
    });
    const posts = saved.map(post=>post.post)
    const last = posts[posts.length - 1];
    cursor = last && posts.length >= 3 ? last.id : 0;
    return res.json({posts,cursor})
}

const savePost:RequestHandler = async(req,res)=>{
    const id = parseInt(req.params.id)
    const post = await prisma.post.findUnique({where:{id}})
    if(!post){
        throw new NotFoundError("Post Not Found")
    }
    const blocked = await prisma.relation.findFirst({
        where: {
            OR: [{ userId: post.authorId, relatedId: req.user?.id },
                { userId: req.user?.id, relatedId: post.authorId }]},
    });
    if(blocked){
        throw new ForbiddenError("You Can't Save This Post")
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

                    /* Post React Section */
const getPostReactions:RequestHandler = async(req,res)=>{
    const id = parseInt(req.params.id);
    const reactions = await prisma.postReaction.findMany({
        where:{postId:id},include:{user:{select:userSelect}}
    })
    let likeCount = 0
    reactions.forEach(react=>{
        if(react.reaction) likeCount+=1
    })
    return res.json({reactions,_count:{like:likeCount,dislike:reactions.length-likeCount}})
}
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
    const react = (req.query.react==="like")?true:false
    let msg =`Post ${(react===true)?"Liked":"Disliked"}`
    let removed = false
    const post = await prisma.post.findUnique({where:{id}})
    if (!post) {
        throw new NotFoundError("Post Not Found");
    }
    const blocked = await prisma.relation.findFirst({
        where: {
            OR: [{ userId: post.authorId, relatedId: req.user?.id },
                { userId: req.user?.id, relatedId: post.authorId }]},
    });
    if(blocked){
        throw new ForbiddenError("You React to This Post")
    }
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
        await createNotification(
            post.authorId,
            `${req.user?.firstName} ${req.user?.lastName} Reacted On Your Post`
        );
    }else{
        if(exists.reaction!==react){
            reaction=await prisma.postReaction.update({where:{
                postId_userId:{
                postId:id,
                userId:req.user!.id
            }
            },data:{reaction:react}})
        }else{
            reaction = await prisma.postReaction.delete({where:{
                postId_userId:{
                postId:id,
                userId:req.user!.id
                }   
            }})
            msg = "Reaction removed"
            removed = true
        }
    }
    return res.status(StatusCodes.CREATED).json({msg,removed,reaction})
}

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
postRouter.get("/",getPosts)
postRouter.get("/:id",getPost)
postRouter.get("/group/:id",getGroupPosts)
postRouter.post("/create",uploader.array("images"),createPost);
postRouter.patch("/update/:id",validationMiddleware(UpdatePostDTO,true),updatePost)
postRouter.delete("/delete/:id",deletePost)
