import { RequestHandler, Router } from "express";
import { ForbiddenError, NotFoundError } from "../errors";
import { prisma, StatusCodes, userSelect } from "../utils";

export const commentRouter = Router()

const getPostComments:RequestHandler = async (req,res)=>{
    const id = parseInt(req.params.id)
    let cursor = parseInt(req.query.cursor as string)
    const queryOptions:Record<string,any> = {cursor:undefined,skip:undefined}
    if(cursor){
        queryOptions.cursor = {id:cursor}
        queryOptions.skip = 1
    }
    const comments = await prisma.comment.findMany({
        take: 10,
        where: { postId: id, commentId: null },
        orderBy: [{ id: "desc" }, { createTime: "desc" }],
        include: {
            reactions: true,
            author: { select: { ...userSelect } },
            _count: { select: { comments: true } },
        },
        ...queryOptions,
    });
    const last = comments[comments.length-1]
    cursor = (last)?last.id:0
    return res.json({comments,cursor})
};

const getSubComments:RequestHandler = async (req,res)=>{
    const id = parseInt(req.params.id)
    const parentComment = await prisma.comment.findUnique({where:{id}})
    if(!parentComment){
        throw new NotFoundError("Comment Not Found")
    }
    const comments = await prisma.comment.findMany({
        where: { commentId: id },
        orderBy: { createTime: "desc" },
        include: {
            reactions: true,
            author: { select: { ...userSelect } },
            _count: { select: { comments: true } },
        },
    });
    return res.json({comments})
}

const createComment:RequestHandler = async (req,res)=>{
    const id = parseInt(req.params.id)
    const {body} = req.body
    const commentId = parseInt(req.query.commentId as string)
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
        throw new ForbiddenError("You Can't Comment on this Post")
    }
    if(!post.commentable){
        throw new ForbiddenError("You Cant Comment On This Post Owner Locked Comments")
    }
    const queryOptions = { body, postId: id, authorId: req.user!.id,commentId };
    if(commentId){
        queryOptions.commentId = commentId
    }
    const comment = await prisma.comment.create({data:{...queryOptions}})
    return res.status(StatusCodes.CREATED).json({comment})
};

const updateComment:RequestHandler = async (req,res)=>{
    const id = parseInt(req.params.id);
    const { body } = req.body;
    const old = await prisma.comment.findUnique({
        where: { id },
        include: { author: { select: { ...userSelect } } },
    });
    if(!old){
        throw new NotFoundError("Comment Not Found")
    }
    if(old.authorId!==req.user!.id){
        throw new ForbiddenError("You Cant Update This Comment")
    }
    const comment = await prisma.comment.update({where:{id},data:{body,edited:true}})
    const msg = (!comment)?"Update Failed":"Update Success"
    return res.json({comment,msg})
};

const deleteComment:RequestHandler = async (req,res)=>{
    const id = parseInt(req.params.id);
    const old = await prisma.comment.findUnique({
        where: { id },
        include: { author: { select: { ...userSelect } }, post: true },
    });
    if(!old){
        throw new NotFoundError("Comment Not Found")
    }
    if(old.authorId!==req.user!.id){
        throw new ForbiddenError("You Cant Delete This Comment")
    }
    if(old.post.authorId!==req.user!.id){
        throw new ForbiddenError("You Cant Delete This Comment");
    }
    const comment = await prisma.comment.delete({where:{id}})
    return res.json({comment})
};

const commentReact:RequestHandler = async(req,res)=>{
    const id = parseInt(req.params.id)
    let reaction;
    const react = Boolean(req.query.react)
    let msg = `Post ${react === true ? "Liked" : "Disliked"}`;
    const comment = await prisma.comment.findUnique({where:{id}})
    if(!comment){
        throw new NotFoundError("Comment Not Found")
    }
    const blocked = await prisma.relation.findFirst({
        where: {
            OR: [
                { userId: comment.authorId, relatedId: req.user?.id },
                { userId: req.user?.id, relatedId: comment.authorId },
            ],
        },
    });
    if (blocked) {
        throw new ForbiddenError("You Can't React To Comment on this Post");
    }
    const exists = await prisma.commentReaction.findUnique({where:{
        commentId_userId:{
            commentId:id,
            userId:req.user!.id
        }
    }})
    if(!exists){
        reaction=await prisma.commentReaction.create({data:{
            commentId:id,
            userId:req.user!.id,
            reaction:react
        }})
    }else{
        if(exists.reaction!==react){
            reaction=await prisma.commentReaction.update({where:{
                commentId_userId:{
                commentId:id,
                userId:req.user!.id
            }
            },data:{reaction:react}})
        }else{
            await prisma.commentReaction.delete({where:{
                commentId_userId:{
                commentId:id,
                userId:req.user!.id
                }   
            }})
            msg = "React Deleted"
        }
    }
    return res.status(StatusCodes.CREATED).json({msg,reaction})
}


commentRouter.get("/post/:id",getPostComments)
commentRouter.get("/:id/sub",getSubComments)
commentRouter.post("/create/:id",createComment)
commentRouter.patch("/update/:id",updateComment)
commentRouter.delete("/delete/:id",deleteComment)
commentRouter.post("/react",commentReact)
