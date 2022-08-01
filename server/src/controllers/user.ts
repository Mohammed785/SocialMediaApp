import { RequestHandler } from "express";
import { NotFoundError } from "../errors";
import { prisma, resizeImage, unlinkImage, userSelect } from "../utils";


export const userInfo: RequestHandler = async (req, res) => {
    const {id} = req.query
    if(id){
        const user = await prisma.user.findUnique({where:{id:parseInt(id as string)},select:{...userSelect,gender:true,birthDate:true,bio:true}})
        if(!user){
            throw new NotFoundError("User Not Found")
        }
        return res.json({user})
    }
    return res.json({ user: req.user });
};

export const userSearch:RequestHandler = async (req,res)=>{
    const {search} = req.query
    let cursor = parseInt(req.query.cursor as string)
    const searchQuery: Record<string, any> = {
        cursor: undefined,
        skip: undefined,
        where: { email: { contains:search } },
    };
    if(cursor){
        searchQuery.cursor = {id:cursor}
        searchQuery.skip = 1
    }
    const users = await prisma.user.findMany({
        take:4,
        orderBy:[{id:"asc"}],
        ...searchQuery,
        select:{id:true,firstName:true,lastName:true,profileImg:true}
    })
    const last = users[users.length - 1];
    cursor = (last && users.length >= 4) ? last.id : 0;
    return res.json({result:users,cursor})
}

export const changeImg:RequestHandler = async(req,res)=>{
    const type = req.query.type
    const image = req.file?.filename
    await resizeImage(req.file!.path,req.file!.filename,req.file!.destination)
    if(type=="profile"){
        req.user!.profileImg!=="default.jpg"&&unlinkImage(req.user!.profileImg)
        await prisma.user.update({where:{id:req.user!.id},data:{profileImg:image}})
    }else if(type=="cover"){
        req.user!.coverImg!=="cover.jpg"&&unlinkImage(req.user!.coverImg);
        await prisma.user.update({where:{id:req.user!.id},data:{coverImg:image}})
    }
    return res.json({image})
}