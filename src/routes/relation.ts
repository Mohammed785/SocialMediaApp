import { RequestHandler, Router } from "express"
import { BadRequestError, NotFoundError } from "../errors";
import { prisma, StatusCodes,userSelect } from "../utils"

export const relationRouter = Router()

const getFriendRequests:RequestHandler = async(req,res)=>{
    const requests = await prisma.friendRequest.findMany({
        where: {
            receiverId: req.user?.id,
            accepted: null,
        },
        orderBy: { createTime: "desc" },
        include: { sender: { select: { ...userSelect } } },
    });
    return res.json({requests})
}

const getFriendRequestHistory:RequestHandler = async(req,res)=>{
    const requests = await prisma.friendRequest.findMany({
        where: {
            OR: [{ receiverId: req.user?.id }, { senderId: req.user?.id }],
            accepted: { not: null },
        },
        orderBy: { createTime: "desc" },
        include: { sender: { select: { ...userSelect } } },
    });
    return res.json({requests})
}

const sendFriendRequest:RequestHandler = async (req,res)=>{
    const id = parseInt(req.params.id)
    if (id === req.user?.id) {
        throw new BadRequestError("You Cant Send Request To Your Self");
    }
    const userExists = await prisma.user.findUnique({ where: { id } });
    if (!userExists) {
        throw new NotFoundError("User Not Found");
    }
    const oldReq = await prisma.friendRequest.findFirst({
        where:{
            OR:[{senderId:req.user!.id,receiverId:id},{senderId:id,receiverId:req.user!.id}]
        }
    })
    if(oldReq){
        if((oldReq.senderId ===req.user?.id||oldReq.senderId===id) && oldReq.accepted!==false){
            const msg = oldReq.accepted
                ? "You Are Already Friends"
                : "Request Already Exists Waiting For Response";
            throw new BadRequestError(msg);
        }
    }
    const friend = await prisma.user.findUnique({where:{id}})
    if(!friend){
        throw new NotFoundError("Friend Not Found");
    }
    const isFriend = await prisma.relation.findFirst({
        where:{
            OR:[{userId:id,relatedId:req.user?.id},{userId:req.user?.id,relatedId:id}]
        }
    })
    if(isFriend?.friend){
        throw new BadRequestError("You Are Already Friends")
    }else if(!isFriend?.friend){
        throw new BadRequestError("You Blocked this User You Can't Send Him Friend Request")
    }
    const request = await prisma.friendRequest.create({data:{senderId:req.user!.id,receiverId:id}})
    return res.status(StatusCodes.CREATED).json({request})
}

const acceptFriendRequest:RequestHandler = async (req,res)=>{
    const id = parseInt(req.params.id)
    if(id===req.user?.id){
        throw new BadRequestError("You Cant Send Request To Your Self")
    }
    const friendReq = await prisma.friendRequest.findFirst({
        where:{
            senderId:id,receiverId:req.user!.id
        }
    })
    if(!friendReq){
        throw new NotFoundError("No Friend Request Found")
    }
    if(friendReq.accepted){
        throw new BadRequestError("Already Friends")
    }else if(friendReq.accepted===false){
        throw new BadRequestError("You Already Declined This Request")
    }
    const request = await prisma.friendRequest.update({
        where: {
            senderId_receiverId:{
                senderId: id,
                receiverId: req.user!.id
            }
        },
        data:{accepted:true,acceptTime:new Date().toISOString()}
    });
    const friendship = await prisma.relation.createMany({
        data:[
            {userId:id,relatedId:req.user!.id,friend:true},
            {userId:req.user!.id,relatedId:id,friend:true}
        ]
    })
    return res.json({msg:"Request Accepted",request})
}

const declineFriendRequest:RequestHandler = async (req,res)=>{
    const id = parseInt(req.params.id)
    if (id === req.user?.id) {
        throw new BadRequestError("You Cant Send Request To Your Self");
    }
    const friendReq = await prisma.friendRequest.findFirst({
        where:{
            senderId:id,receiverId:req.user!.id
        }
    })
    if(!friendReq){
        throw new NotFoundError("No Friend Request Found")
    }
    if(friendReq.accepted){
        throw new BadRequestError("Already Friends")
    }else if(friendReq.accepted===false){
        throw new BadRequestError("You Already Declined This Request")
    }
    const request = await prisma.friendRequest.update({
        where: {
            senderId_receiverId:{
                senderId: id,
                receiverId: req.user!.id
            }
        },
        data:{accepted:false}
    });
    return res.json({msg:"Request Declined",request})
}

const cancelFriendRequest:RequestHandler = async (req,res)=>{
    const id = parseInt(req.params.id)
    const friendReq = await prisma.friendRequest.findFirst({
        where:{
            senderId:req.user!.id,receiverId:id
        }
    })
    if(!friendReq){
        throw new NotFoundError("No Friend Request Found")
    }
    if(friendReq.accepted){
        throw new BadRequestError("Already Friends")
    }
    const request = await prisma.friendRequest.delete({
        where: {
            senderId_receiverId: {
                senderId: req.user!.id,
                receiverId: id,
            },
        },
    });
    return res.json({msg:"Request Canceled",request})
}

const blockUser:RequestHandler = async(req,res)=>{
    const id = parseInt(req.params.id as string)
    if (id === req.user?.id) {
        throw new BadRequestError("You Cant Block Your Self");
    }
    let block;
    const userExists = await prisma.user.findUnique({where:{id}})
    if(!userExists){
        throw new NotFoundError("User Not Found")
    }
    const isRelated = await prisma.relation.findMany({
        where:{
            OR:[{userId:id,relatedId:req.user!.id},{userId:req.user!.id,relatedId:id}]
        }
    })
    if(isRelated.length){
        isRelated.forEach(async(relation)=>{
            if(!relation.friend){
                throw new BadRequestError("You Have Already Blocked This User");
            }else{
                await prisma.relation.deleteMany({
                    where: {OR: [{ userId: id, relatedId: req.user!.id },
                            { userId: req.user!.id, relatedId: id }]},
                });
                block = await prisma.relation.create({
                    data:{userId:req.user!.id,relatedId:id,friend:false}
                })
            }
        })
    }
    return res.json({ block });
}
const unblockUser:RequestHandler = async(req,res)=>{
    const id = parseInt(req.params.id as string)
    if (id === req.user?.id) {
        throw new BadRequestError("You Cant Block Your Self");
    }
    const isRelated = await prisma.relation.findFirst({
        where:{
            userId:req.user!.id,relatedId:id,friend:false
        }
    })
    if(!isRelated){
        throw new NotFoundError("You Didn't Block This User You Can't Unblock Him")
    }
    const unblock = await prisma.relation.delete({
        where: {
            userId_relatedId:{
                userId: req.user!.id,
                relatedId: id,
            }
        },
    })
    return res.json({ unblock });
}

const getBlockList:RequestHandler = async(req,res)=>{
    const list = await prisma.relation.findMany({
        where: { userId: req.user!.id, friend: false },
        include: { related: { select: { ...userSelect } } },
    });
    return res.json({list})
}

const getFriendList:RequestHandler = async(req,res)=>{
    const list = await prisma.relation.findMany({
        where: { userId: req.user!.id, friend: true },
        include: { related: { select: { ...userSelect } } },
    });
    return res.json({ list });
}

const unfriendUser:RequestHandler = async(req,res)=>{
    const id = parseInt(req.params.id as string)
    if (id === req.user?.id) {
        throw new BadRequestError("You Cant Unfriend Your Self");
    }
    const isRelated = await prisma.relation.findFirst({
        where:{
            userId:req.user!.id,relatedId:id,friend:true
        }
    })
    if(!isRelated){
        throw new BadRequestError("You Are Not Friend With This User")
    }
    const unfriend = await prisma.relation.deleteMany({
        where:{
            OR:[{userId:id,relatedId:req.user!.id},{userId:req.user!.id,relatedId:id}],
            friend:true
        }
    })
    return res.json({ msg:"You Removed Your Friendship" });
}

relationRouter.get("/request",getFriendRequests)
relationRouter.get("/request/history",getFriendRequestHistory)
relationRouter.post("/request/send/:id",sendFriendRequest)
relationRouter.post("/request/accept/:id",acceptFriendRequest)
relationRouter.post("/request/decline/:id",declineFriendRequest)
relationRouter.delete("/request/cancel/:id",cancelFriendRequest)
relationRouter.get("/friend/list",getFriendList)
relationRouter.post("/friend/unfriend",unfriendUser)
relationRouter.get("/block/list",getBlockList)
relationRouter.post("/block",blockUser)
relationRouter.post("/block/unblock",unblockUser)
