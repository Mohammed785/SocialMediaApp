import { RequestHandler, Router } from "express";
import { prisma } from "../utils";


export const notificationRouter = Router()

const getNotifications:RequestHandler = async(req,res)=>{
    let cursor = parseInt(req.query.cursor as string);
    const cursorOptions: Record<string, any> = {
        cursor: undefined,
        skip: undefined,
    };
    if (cursor) {
        cursorOptions.cursor = { id: cursor };
        cursorOptions.skip = 1;
    }
    const notifications = await prisma.notification.findMany({
        take:7,
        ...cursorOptions,
        where:{
            receiverId:req.user?.id,
            seen:false
        },
        orderBy:{ id: "desc" }
    })
    const last = notifications[notifications.length - 1];
    cursor = last ? last.id : 0;
    return res.json({notifications,cursor})
}

const markAsRead:RequestHandler = async(req,res)=>{
    const seenIds = req.body.ids
    await prisma.notification.updateMany({
        where:{
            id:{in:seenIds}
        },data:{seen:true}
    })
    return res.json({msg:"Seen"})
}

notificationRouter.get("/",getNotifications)
notificationRouter.patch("/seen",markAsRead)