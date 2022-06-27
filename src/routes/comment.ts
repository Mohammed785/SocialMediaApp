import { RequestHandler, Router } from "express";
import { ForbiddenError, NotFoundError } from "../errors";
import { prisma, StatusCodes } from "../utils";

export const commentRouter = Router()

const getPostComments:RequestHandler = async (req,res)=>{
    const id = parseInt(req.params.id)
    const cursor = req.query.cursor
    const queryOptions:Record<string,any> = {cursor:undefined,skip:undefined}
    if(cursor!=='0'){
        queryOptions["cursor"] = {id:parseInt(cursor as string)}
        queryOptions["skip"] = 1
    }
    const comments = await prisma.comment.findMany({
        take: 10,
        where: { postId: id },
        orderBy: [{ id: "desc" }, { createTime: "desc" }]
    });
    return res.json({comments,cursor:comments[comments.length-1].id})
};

const createComment:RequestHandler = async (req,res)=>{
    const id = parseInt(req.params.id)
    const {body} = req.body
    const post = await prisma.post.findUnique({where:{id}})
    if(!post){
        throw new NotFoundError("Post Not Found")
    }
    if(!post.commentable){
        throw new ForbiddenError("You Cant Comment On This Post Owner Locked Comments")
    }
    const comment = await prisma.comment.create({data:{body,postId:id,authorId:req.user!.id}})
    return res.status(StatusCodes.CREATED).json({comment})
};

const updateComment:RequestHandler = async (req,res)=>{
    const id = parseInt(req.params.id);
    const { body } = req.body;
    const old = await prisma.comment.findUnique({where:{id},include:{author:true}})
    if(!old){
        throw new NotFoundError("Comment Not Found")
    }
    if(old.authorId!==req.user!.id){
        throw new ForbiddenError("You Cant Update This Comment")
    }
    const comment = await prisma.comment.update({where:{id},data:{body,edited:true}})
    return res.json({comment})
};

const deleteComment:RequestHandler = async (req,res)=>{
    const id = parseInt(req.params.id);
    const old = await prisma.comment.findUnique({where:{id},include:{author:true,post:true}})
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

commentRouter.get("/post/:id",getPostComments)
commentRouter.post("/create/:id",createComment)
commentRouter.patch("/update/:id",updateComment)
commentRouter.delete("/delete/:id",deleteComment)

