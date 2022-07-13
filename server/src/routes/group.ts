import { RequestHandler, Router } from "express";
import { unlinkSync } from "fs";
import { BadRequestError, ForbiddenError, NotFoundError } from "../errors";
import { createNotification, prisma, resizeImage, StatusCodes, uploader, userSelect } from "../utils";

export const groupRouter = Router()


const getGroup:RequestHandler = async(req,res)=>{
    const id = parseInt(req.params.id)
    const group = await prisma.group.findUnique({where:{id},include:{creator:{select:userSelect}}})
    if(!group){
        throw new NotFoundError("Group Not Found")
    }
    return res.json({group})
}

const createGroup:RequestHandler = async(req,res)=>{
    const { name, description, isPrivate } = req.body;
    if(!req.file?.path){
        throw new BadRequestError("Please Provide Group Image")
    }
    const group = await prisma.group.create({
        data: {
            creatorId: req.user!.id,
            image: req.file.path,
            name,
            description,
            private: isPrivate === "true" ? true : false,
        },
    });
    await resizeImage(req.file.path,req.file.filename,req.file.destination)
    return res.status(StatusCodes.CREATED).json({group})
}

const editGroup:RequestHandler = async(req,res)=>{
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
    if (req.body.private) queryObj.private = req.body.Private === "true" ? true : false;
    if(req.file){
        unlinkSync(old.image)
        await resizeImage(req.file.path,req.file.filename,req.file.destination)
        queryObj.image = req.file!.path
    }
    const group = await prisma.group.update({where:{id},data:{...queryObj}})
    return res.status(StatusCodes.ACCEPTED).json({group})
}

const deleteGroup:RequestHandler = async(req,res)=>{
    const id = parseInt(req.params.id);
    const group = await prisma.group.findUnique({ where: { id } });
    if (!group) {
        throw new NotFoundError("Group Not Found");
    }
    if (group.creatorId !== req.user?.id) {
        throw new ForbiddenError("You Can't Delete This Group");
    }
    await prisma.group.delete({where:{id}})
    unlinkSync(group.image)
    return res.json({group})
}


const getGroupRequests: RequestHandler = async (req, res) => {
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

const acceptGroupRequest: RequestHandler = async (req, res) => {
    const groupId = parseInt(req.params.groupId),
        userId = parseInt(req.params.userId);
    const group = await prisma.group.findUnique({ where: { id:groupId } });
    if (!group) {
        throw new NotFoundError("Group Not Found");
    }
    if (group.creatorId !== req.user?.id) {
        throw new ForbiddenError("You Can't Respond To This Group Requests");
    }
    let request = await prisma.groupRequest.findUnique({where:{groupId_senderId:{
        groupId,senderId:userId
    }}})
    if(request?.accepted===true){
        return res.json({msg:"User Already A Member"})
    }
    request = await prisma.groupRequest.update({
        where: {
            groupId_senderId: {
                groupId,
                senderId: userId,
            },
        },
        data: { accepted: true, acceptTime: new Date() },
    });
    await createNotification(request.senderId,`Your Join Request To ${group.name} Group Is Accepted`)
    await prisma.groupMembership.create({data:{groupId,userId}})
    return res.json({ msg: "Accepted", request });
    
};


const declineGroupRequest: RequestHandler = async (req, res) => {
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

const cancelGroupRequest: RequestHandler = async (req, res) => {
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
    if (request.accepted === true) {
        throw new BadRequestError(
            "Request Already Accepted Try To Leave The The Group"
        );
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


const getGroupMembers: RequestHandler = async (req, res) => {
    const id = parseInt(req.params.id);
    const members = await prisma.groupMembership.findMany({
        where: { groupId: id },
        include: { user: { select: userSelect } },
    });
    return res.json({ count: members.length, members });
};

const joinGroup: RequestHandler = async (req, res) => {
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

const leaveGroup: RequestHandler = async (req, res) => {
    const id = parseInt(req.params.id);
    const membership = await prisma.groupMembership.delete({
        where: { groupId_userId: { groupId: id, userId: req.user!.id } },
    });
    await prisma.post.deleteMany({ where: { authorId: req.user?.id, groupId:id } });
    return res.json({msg:"Leaved Group Successfully",membership})
};


const kickGroupMember: RequestHandler = async (req, res) => {
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


groupRouter.post("/create",uploader.single("image"),createGroup)
groupRouter.patch("/update/:id",uploader.single("image"),editGroup)
groupRouter.delete("/delete/:id",deleteGroup)
groupRouter.get("/:id",getGroup)

groupRouter.get("/:id/request/all", getGroupRequests);
groupRouter.patch("/:groupId/request/:userId/accept", acceptGroupRequest);
groupRouter.delete("/:groupId/request/:userId/decline",declineGroupRequest)
groupRouter.delete("/:id/request/cancel",cancelGroupRequest)

groupRouter.get("/:id/member/all", getGroupMembers);
groupRouter.post("/:id/join", joinGroup);
groupRouter.delete("/:id/member/leave", leaveGroup);
groupRouter.delete("/:groupId/member/:userId/kick", kickGroupMember);
