import { RequestHandler } from "express";
import { ForbiddenError, NotFoundError } from "../errors";
import { createNotification, prisma, StatusCodes, userSelect } from "../utils";


export const getPostComments:RequestHandler = async (req,res)=>{
    const id = parseInt(req.params.id)
    let cursor = parseInt(req.query.cursor as string)
    const queryOptions:Record<string,any> = {cursor:undefined,skip:undefined}
    if(cursor){
        queryOptions.cursor = {id:cursor}
        queryOptions.skip = 1
    }
    const comments = await prisma.comment.findMany({
        take: 6,
        where: { postId: id },
        orderBy: [{ id: "desc" }, { createTime: "desc" }],
        include: {
            reactions: {select:{reaction:true,user:{select:userSelect}}},
            author: { select: { ...userSelect } }
        },
        ...queryOptions,
    });
    const last = comments[comments.length-1]
    cursor = (last && comments.length>=6)?last.id:0
    return res.json({comments,cursor})
};

export const createComment:RequestHandler = async (req,res)=>{
    const id = parseInt(req.params.id)
    const {body} = req.body
    const post = await prisma.post.findUnique({where:{id}})
    if(!post){
        throw new NotFoundError("Post Not Found")
    }
    const blocked = await prisma.relation.findFirst({
        where: {
            OR: [{ userId: post.authorId, relatedId: req.user?.id },
                { userId: req.user?.id, relatedId: post.authorId }],friend:false},
    });
    if(blocked){
        throw new ForbiddenError("You Can't Comment on this Post")
    }
    if(!post.commentable){
        throw new ForbiddenError("You Cant Comment On This Post Owner Locked Comments")
    }
    const queryOptions = { body, postId: id, authorId: req.user!.id };
    const comment = await prisma.comment.create({data:{...queryOptions}})
    if(post.authorId!==req.user?.id){
        await createNotification(
            post.authorId,
            `${req.user?.firstName} ${req.user?.lastName} Commented On Your Post`
        );
    }
    return res.status(StatusCodes.CREATED).json({comment})
};

export const updateComment:RequestHandler = async (req,res)=>{
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

export const deleteComment:RequestHandler = async (req,res)=>{
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

export const commentReact:RequestHandler = async(req,res)=>{
    const id = parseInt(req.params.id)
    let reaction;
    const react = req.query.react === "like" ? true : false;
    let msg = `Post ${react === true ? "Liked" : "Disliked"}`;
    let removed = false;
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
            friend:false
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
        await createNotification(
            comment.authorId,
            `${req.user?.firstName} ${req.user?.lastName} Reacted On Your Comment`
        );
    }else{
        if(exists.reaction!==react){
            reaction=await prisma.commentReaction.update({where:{
                commentId_userId:{
                commentId:id,
                userId:req.user!.id
            }
            },data:{reaction:react}})
        }else{
            reaction = await prisma.commentReaction.delete({where:{
                commentId_userId:{
                commentId:id,
                userId:req.user!.id
                }   
            }})
            msg = "Reaction removed";
            removed = true;
        }
    }
    return res.status(StatusCodes.CREATED).json({msg,removed,reaction})
}

