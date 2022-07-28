import { RequestHandler, Router } from "express";
import { join } from "path";
import { BadRequestError, ForbiddenError, NotFoundError } from "../errors";
import { prisma, resizeImage, StatusCodes, unlinkImage, uploader, userSelect } from "../utils";


export const statusRouter = Router()

const getAvailableStatus: RequestHandler = async (req, res) => {
    const friendsList = await prisma.relation.findMany({
        where: { userId: req.user!.id, friend: true },
        select: { relatedId: true },
    });
    const stories = await prisma.status.findMany({
        where: { authorId: { in: friendsList.map((f) => f.relatedId) } },
        distinct: ["authorId"],
        include:{author:{select:userSelect}}
    });
    return res.json({stories})
};

const getAllStatus:RequestHandler = async(req,res)=>{
    const authorId = parseInt(req.query.id as string||"-1")
    let status = await prisma.status.findMany({where:{authorId:(authorId!==-1)?authorId:req.user!.id}})
    status = status.filter(async(stat)=>{
        if (new Date().getTime() - stat.createTime.getTime() <= 86400000) return true;
        await prisma.status.delete({where:{id:stat.id}});
    })
    const count = status.length
    return res.json({status,count})
};

const createStatus:RequestHandler = async(req,res)=>{
    const {caption} = req.body
    let image;
    if(req.file){
        await resizeImage(req.file.path, req.file.filename, req.file.destination);
        image = req.file?.filename
    }
    if(!caption && !req.file){
        throw new BadRequestError("Cant Create Empty Story")
    }
    const status = await prisma.status.create({
        data: { caption, image, authorId: req.user!.id },
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
        unlinkImage(status.image)
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
            friend:false
        },
    });
    if (blocked) {
        throw new ForbiddenError("You Can't View this Status");
    }
    const view = await prisma.statusView.create({data:{statusId:id,viewerId:req.user!.id}})
    return res.json({view})
};


statusRouter.get("/available",getAvailableStatus)
statusRouter.get("/author/",getAllStatus)
statusRouter.post("/create",uploader.single("image"),createStatus)
statusRouter.delete("/:id/delete",deleteStatus)
statusRouter.post("/:id/view",viewStatus)
statusRouter.get("/:id/views",getStatusViews)