import { RequestHandler } from "express"
import { BadRequestError, NotFoundError } from "../errors";
import { createNotification, prisma, StatusCodes,userSelect } from "../utils"


export const getFriendRequests:RequestHandler = async(req,res)=>{
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

export const getFriendRequestHistory:RequestHandler = async(req,res)=>{
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

export const sendFriendRequest:RequestHandler = async (req,res)=>{
    const id = parseInt(req.params.id)
    if (id === req.user?.id) {
        throw new BadRequestError("You Cant Send Request To Your Self");
    }
    const isFriend = await prisma.relation.findFirst({
        where:{
            OR:[{userId:id,relatedId:req.user?.id},{userId:req.user?.id,relatedId:id}]
        }
    })
    if(isFriend?.friend){
        throw new BadRequestError("You Are Already Friends")
    }else if(isFriend && !isFriend?.friend){
        throw new BadRequestError("You Blocked this User You Can't Send Him Friend Request")
    }
    const request = await prisma.friendRequest.create({data:{senderId:req.user!.id,receiverId:id}})
    await createNotification(
        request.receiverId,
        `${req.user?.firstName} ${req.user?.lastName} Sent You Friend Request`
    );
    return res.status(StatusCodes.CREATED).json({request})
}

export const acceptFriendRequest:RequestHandler = async (req,res)=>{
    const id = parseInt(req.params.id)
    if(id===req.user?.id){
        throw new BadRequestError("You Cant Send Request To Your Self")
    }
    const request = await prisma.friendRequest.delete({
        where: {
            senderId_receiverId:{
                senderId: id,
                receiverId: req.user!.id
            }
        }
    });
    const friendship = await prisma.relation.createMany({
        data:[
            {userId:id,relatedId:req.user!.id,friend:true},
            {userId:req.user!.id,relatedId:id,friend:true}
        ]
    })
    await prisma.chat.create({ data: { user1Id: req.user!.id, user2Id: id }});
    await createNotification(
        request.senderId,
        `${req.user?.firstName} ${req.user?.lastName} Accepted Your FriendRequest`
    );
    return res.json({msg:"Request Accepted",request})
}

export const declineFriendRequest:RequestHandler = async (req,res)=>{
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
    const request = await prisma.friendRequest.delete({
        where: {
            senderId_receiverId:{
                senderId: id,
                receiverId: req.user!.id
            }
        }
    });
    return res.json({msg:"Request Declined",request})
}

export const cancelFriendRequest:RequestHandler = async (req,res)=>{
    const id = parseInt(req.params.id)
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

export const blockUser:RequestHandler = async(req,res)=>{
    const id = parseInt(req.params.id as string)
    if (id === req.user?.id) {
        throw new BadRequestError("You Cant Block Your Self");
    }
    let block;    
    await prisma.relation.deleteMany({
        where: {OR: [{ userId: id, relatedId: req.user!.id },
                { userId: req.user!.id, relatedId: id }],friend:true}
    });
    block = await prisma.relation.create({
        data:{userId:req.user!.id,relatedId:id,friend:false}
    })
    await prisma.chat.updateMany({
        where: {
            OR: [{ user1Id: req.user!.id, user2Id: id },{ user1Id: id, user2Id: req.user!.id }],
        },
        data: { active: false },
    });
    return res.json({ block });
}

export const unblockUser:RequestHandler = async(req,res)=>{
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
    await prisma.chat.updateMany({where: { OR: [{ user1Id: req.user!.id,user2Id:id }, 
        { user1Id:id,user2Id: req.user!.id }] },data:{active:true}});
    return res.json({ unblock });
}

export const getBlockList:RequestHandler = async(req,res)=>{
    const list = await prisma.relation.findMany({
        where: { userId: req.user!.id, friend: false },
        include: { related: { select: { ...userSelect } } },
    });
    return res.json({list})
}

export const getFriendList:RequestHandler = async(req,res)=>{
    const id = parseInt(req.params.id)
    const list = await prisma.relation.findMany({
        where: { userId: id, friend: true },
        include: { related: { select: { ...userSelect } } },
    });
    return res.json({ list });
}

export const isRelatedTo:RequestHandler = async(req,res)=>{
    const id = parseInt(req.params.id);
    const relation = await prisma.relation.findMany({
        where: {
            OR: [ { userId: id, relatedId: req.user!.id }, { userId: req.user!.id, relatedId: id } ]
        }
    });
    const request = await prisma.friendRequest.findFirst({
        where: {
            OR:[
                { senderId: req.user!.id, receiverId: id },
                { senderId: id, receiverId: req.user!.id },    
            ]
        }
    });
    return res.json({relation,request})
}

export const unfriendUser:RequestHandler = async(req,res)=>{
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
    await prisma.chat.updateMany({
        where: { OR: [{ user1Id: req.user!.id,user2Id:id }, { user1Id:id,user2Id: req.user!.id }] },data:{active:false}
    });
    return res.json({ msg:"You Removed Your Friendship" });
}
