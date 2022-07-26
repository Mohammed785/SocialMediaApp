import { RequestHandler, Router } from "express";
import { prisma, userSelect } from "../utils";


export const userRouter = Router()

const userInfo: RequestHandler = async (req, res) => {
    const {id} = req.query
    if(id){
        const user = await prisma.user.findUnique({where:{id:parseInt(id as string)},select:{...userSelect,gender:true,birthDate:true,bio:true}})
        return res.json({user})
    }
    return res.json({ user: req.user });
};

const userSearch:RequestHandler = async (req,res)=>{
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
        take:2,
        orderBy:[{id:"asc"}],
        ...searchQuery,
        select:{...userSelect}
    })
    const last = users[users.length - 1];
    cursor = last ? last.id : 0;
    return res.json({users,cursor})
}


userRouter.get("/",userInfo)
userRouter.get("/all",userSearch)