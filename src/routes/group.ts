import { RequestHandler, Router } from "express";
import { unlinkSync } from "fs";
import { BadRequestError, ForbiddenError, NotFoundError } from "../errors";
import { prisma, resizeImage, StatusCodes, uploader } from "../utils";

export const groupRouter = Router()


const getGroup:RequestHandler = async(req,res)=>{
    const id = parseInt(req.params.id)
    const group = await prisma.group.findUnique({where:{id}})
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


groupRouter.post("/create",uploader.single("image"),createGroup)
groupRouter.patch("/update/:id",uploader.single("image"),editGroup)
groupRouter.delete("/delete/:id",deleteGroup)
groupRouter.get("/:id",getGroup)