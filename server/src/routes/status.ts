import { RequestHandler, Router } from "express";
import { unlinkSync } from "fs";
import { ForbiddenError, NotFoundError } from "../errors";
import { prisma, resizeImage, StatusCodes, uploader } from "../utils";


export const statusRouter = Router()

const getAllStatus:RequestHandler = async(req,res)=>{
    const authorId = parseInt(req.params.authorId)
    const author = await prisma.status.findUnique({where:{id:authorId}})
    if(!author){
        throw new NotFoundError("User Not Found")
    }
    let status = await prisma.status.findMany({where:{authorId},include:{author:true}})
    status = status.filter(async(stat)=>{
        if (new Date().getTime() - stat.createTime.getTime() <= 86400000) return true;
        await prisma.status.delete({where:{id:stat.id}});
    })
    const count = status.length
    return res.json({status,count})
};

const createStatus:RequestHandler = async(req,res)=>{
    const {caption} = req.body
    if(req.file){
        await resizeImage(req.file.path, req.file.filename, req.file.destination);
    }
    const status = await prisma.status.create({
        data: { caption, image: req.file!.path, authorId: req.user!.id },
    });
    return res.status(StatusCodes.CREATED).json({status})
};

const deleteStatus:RequestHandler = async(req,res)=>{
    const id = parseInt(req.params.id);
    const status = await prisma.status.findUnique({where:{id}})
    if(!status){
        throw new NotFoundError("Status Not Found");
    }
    if(status.authorId!==req.user!.id){
        throw new ForbiddenError("You Can't Delete This Status");
    }
    if(status.image){
        unlinkSync(status.image)
    }
    await prisma.status.delete({ where: { id } });
    return res.json({status})
};
const getStatusViews:RequestHandler = async(req,res)=>{
    const id = parseInt(req.params.id);
    const status = await prisma.statusView.findMany({
        where: { statusId: id },
        include: { viewer: { select: { firstName: true, lastName: true } } },
    });
    return res.json({status})
}
const viewStatus:RequestHandler = async(req,res)=>{
    const id = parseInt(req.params.id);
    const status = await prisma.status.findUnique({where:{id}})
    if(!status){
        throw new NotFoundError("Status Not Found")
    }
    const blocked = await prisma.relation.findFirst({
        where: {
            OR: [
                { userId: status.authorId, relatedId: req.user?.id },
                { userId: req.user?.id, relatedId: status.authorId },
            ],
        },
    });
    if (blocked) {
        throw new ForbiddenError("You Can't View this Status");
    }
    const view = await prisma.statusView.create({data:{statusId:id,viewerId:req.user!.id}})
    return res.json({view})
};

statusRouter.get("/author/:id",getAllStatus)
statusRouter.post("/create",uploader.single("image"),createStatus)
statusRouter.delete(":id/delete",deleteStatus)
statusRouter.post("/:id/view",viewStatus)
statusRouter.get("/:id/views",getStatusViews)