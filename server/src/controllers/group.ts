import { RequestHandler } from "express";
import { BadRequestError, ForbiddenError, NotFoundError } from "../errors";
import {  createNotification,prisma ,resizeImage, StatusCodes, unlinkImage, userSelect } from "../utils";


export const searchGroups:RequestHandler = async(req,res)=>{
    const { search } = req.query;
    let cursor = parseInt(req.query.cursor as string);
    const searchQuery: Record<string, any> = {
        cursor: undefined,
        skip: undefined,
        where: { name: { contains: search } },
    };
    if (cursor) {
        searchQuery.cursor = { id: cursor };
        searchQuery.skip = 1;
    }
    const groups = await prisma.group.findMany({
        take: 4,
        orderBy: [{ id: "asc" }],
        ...searchQuery,
        select:{id:true,name:true,image:true}
    });
    const last = groups[groups.length - 1];
    cursor = last && groups.length >= 4 ? last.id : 0;
    return res.json({result:groups,cursor})
}

export const getUserGroups:RequestHandler = async (req,res)=>{
    let cursor = parseInt(req.query.cursor as string);
    const searchQuery: Record<string, any> = {
        cursor: undefined,
        skip: undefined,
    };
    if (cursor) {
        searchQuery.cursor = { id: cursor };
        searchQuery.skip = 1;
    }
    const groups = await prisma.groupMembership.findMany({
        take:6,
        orderBy:[{groupId:"asc"}],
        ...searchQuery,
        where:{userId:req.user!.id},include:{group:true}
    })
    const last = groups[groups.length - 1];
    cursor = last && groups.length >= 4 ? last.groupId : 0;
    return res.json({groups,cursor})
}

export const getGroup:RequestHandler = async(req,res)=>{
    const id = parseInt(req.params.id)
    const group = await prisma.group.findUnique({where:{id},include:{creator:{select:userSelect}}})
    if(!group){
        throw new NotFoundError("Group Not Found")
    }
    return res.json({group})
}

export const createGroup:RequestHandler = async(req,res)=>{
    const { name, description, isPrivate } = req.body;
    if(!req.file?.path){
        throw new BadRequestError("Please Provide Group Image")
    }
    const group = await prisma.group.create({
        data: {
            creatorId: req.user!.id,
            image: req.file.filename,
            name,
            description,
            private: isPrivate === "true" ? true : false,
        },
    });
    await prisma.groupMembership.create({data:{groupId:group.id,userId:req.user!.id,isAdmin:true}})
    await resizeImage(req.file.path,req.file.filename,req.file.destination)
    return res.status(StatusCodes.CREATED).json({group})
}

export const editGroup:RequestHandler = async(req,res)=>{
    const id = parseInt(req.params.id);
    const queryObj:Record<string,any> = {}
    const old = await prisma.group.findUnique({where:{id}})
    if(!old){
        throw new NotFoundError("Group Not Found")
    }
    if(old.creatorId!==req.user?.id){
        throw new ForbiddenError("You Can't Edit This Group")
    }
    if(req.body.name) queryObj.name = req.body.name
    if (req.body.description) queryObj.description = req.body.description;
    if (req.body.private) queryObj.private = req.body.private === "true" ? true : false;
    if(req.file){
        unlinkImage(old.image)
        await resizeImage(req.file.path,req.file.filename,req.file.destination)
        queryObj.image = req.file!.filename
    }
    const group = await prisma.group.update({where:{id},data:{...queryObj}})
    return res.status(StatusCodes.ACCEPTED).json({group})
}

export const deleteGroup:RequestHandler = async(req,res)=>{
    const id = parseInt(req.params.id);
    const group = await prisma.group.findUnique({ where: { id } });
    if (!group) {
        throw new NotFoundError("Group Not Found");
    }
    if (group.creatorId !== req.user?.id) {
        throw new ForbiddenError("You Can't Delete This Group");
    }
    await prisma.group.delete({where:{id}})
    unlinkImage(group.image)
    return res.json({group})
}


export const getGroupRequests: RequestHandler = async (req, res) => {
    const id = parseInt(req.params.id);
    const group = await prisma.group.findUnique({ where: { id } });
    if (!group) {
        throw new NotFoundError("Group Not Found");
    }
    if (group.creatorId !== req.user?.id) {
        throw new ForbiddenError("You Can't View This Group Requests");
    }
    const requests = await prisma.groupRequest.findMany({
        where: { groupId: id, accepted: null },
        include: { sender: { select: userSelect } },
    });
    return res.json({ requests });
};

export const acceptGroupRequest: RequestHandler = async (req, res) => {
    const groupId = parseInt(req.params.groupId),
        userId = parseInt(req.params.userId);
    const group = await prisma.group.findUnique({ where: { id:groupId } });
    if (!group) {
        throw new NotFoundError("Group Not Found");
    }
    if (group.creatorId !== req.user?.id) {
        throw new ForbiddenError("You Can't Respond To This Group Requests");
    }
    const request = await prisma.groupRequest.delete({
        where: {
            groupId_senderId: {
                groupId,
                senderId: userId,
            },
        }
    });
    await createNotification(request.senderId,`Your Join Request To ${group.name} Group Is Accepted`)
    await prisma.groupMembership.create({data:{groupId,userId}})
    return res.json({ msg: "Accepted", request });
    
};


export const declineGroupRequest: RequestHandler = async (req, res) => {
    const groupId = parseInt(req.params.groupId),
        userId = parseInt(req.params.userId);
    const group = await prisma.group.findUnique({ where: { id: groupId } });
    if (!group) {
        throw new NotFoundError("Group Not Found");
    }
    if (group.creatorId !== req.user?.id) {
        throw new ForbiddenError("You Can't Respond To This Group Requests");
    }
    const request = await prisma.groupRequest.delete({
        where: {
            groupId_senderId: {
                groupId,
                senderId: userId,
        }}
    });
    return res.json({ msg: "Request Declined", request });
};

export const cancelGroupRequest: RequestHandler = async (req, res) => {
    const id = parseInt(req.params.id);
    const request = await prisma.groupRequest.findUnique({
        where: {
            groupId_senderId: {
                groupId: id,
                senderId: req.user!.id,
        }}
    });
    if (!request) {
        throw new NotFoundError("No Request Found To This Group");
    }
    if (request.senderId !== req.user?.id) {
        throw new ForbiddenError("You Can't Cancel This Request");
    }
    await prisma.groupRequest.delete({
        where: {
            groupId_senderId: {
                groupId: id,
                senderId: req.user!.id,
        }}
    });
    return res.json({ request });
};


export const getGroupMembers: RequestHandler = async (req, res) => {
    const id = parseInt(req.params.id);
    const members = await prisma.groupMembership.findMany({
        where: { groupId: id },
        include: { user: { select: userSelect } },
    });
    return res.json({ count: members.length, members });
};

export const joinGroup: RequestHandler = async (req, res) => {
    const id = parseInt(req.params.id);
    const group = await prisma.group.findUnique({ where: { id } });
    if(!group){
        throw new NotFoundError("Group Not Found")
    }
    if(group.private){
        const request = await prisma.groupRequest.create({
            data: { groupId: id, senderId: req.user!.id },
        });
        return res.status(StatusCodes.CREATED).json({msg:"Request Sent",request})
    }
    const membership = await prisma.groupMembership.create({
        data: { groupId: id, userId: req.user!.id },
    });
    return res.status(StatusCodes.CREATED).json({msg:"Joined Group",membership})
};

export const leaveGroup: RequestHandler = async (req, res) => {
    const id = parseInt(req.params.id);
    const membership = await prisma.groupMembership.delete({
        where: { groupId_userId: { groupId: id, userId: req.user!.id } },
    });
    await prisma.post.deleteMany({ where: { authorId: req.user?.id, groupId:id } });
    return res.json({msg:"Leaved Group Successfully",membership})
};


export const kickGroupMember: RequestHandler = async (req, res) => {
    const groupId = parseInt(req.params.groupId),userId = parseInt(req.params.userId)
    const group = await prisma.group.findUnique({where:{id:groupId}})
    if (!group) {
        throw new NotFoundError("Group Not Found");
    }
    if(group.creatorId!==req.user?.id){
        throw new ForbiddenError("You Can't Kick This Member")
    }
    const membership = await prisma.groupMembership.delete({where:{groupId_userId:{
        groupId,userId
    }},include:{user:{select:userSelect},group:true}})
    await prisma.post.deleteMany({where:{authorId:userId,groupId}})
    return res.json({membership})
};

export const checkIsMember:RequestHandler = async(req,res)=>{
    const groupId = parseInt(req.params.id)
    const member = await prisma.groupMembership.findUnique({
        where: { groupId_userId: { groupId, userId: req.user!.id } }
    })
    const request = await prisma.groupRequest.findUnique({
        where:{groupId_senderId:{groupId,senderId:req.user!.id}}
    })
    return res.json({member,request})
}
