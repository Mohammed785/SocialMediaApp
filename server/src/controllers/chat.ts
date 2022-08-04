import { RequestHandler } from "express";
import { prisma } from "../utils";

export const getMessages: RequestHandler = async (req, res) => {
    const id = parseInt(req.params.id);
    const msgs = await prisma.message.findMany({ 
        where: { chatId: id }
    });
    return res.json({ msgs });
};

export const getChats: RequestHandler = async (req, res) => {
    const userSelect = {id:true,firstName:true,lastName:true,profileImg:true};
    const chats = await prisma.chat.findMany({
        where: {
            active:true,
            OR: [{ user1Id: req.user!.id},{ user2Id: req.user!.id}]
        },include:{user1:{select:userSelect},user2:{select:userSelect}}}
    );
    return res.json({chats})
};

export const createMsg: RequestHandler = async (req, res) => {
    const chatId = parseInt(req.params.id)
    const msg = await prisma.message.create({data:{
        content:req.body.content,senderId:req.user!.id,chatId
    }})
    return res.json({msg})
};
