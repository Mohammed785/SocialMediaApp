import { useEffect, useState } from "react";
import { IChat } from "../../@types/chat";
import axiosClient from "../../axiosClient";
import Chat from "./Chat";

interface Props{
    activeId:number
    setActiveId:(id:number)=>void
    setActiveChat: (chat: IChat|null) => void
}

function ChatsList({ activeId, setActiveId, setActiveChat }:Props) {
    const [chats, setChats] = useState<IChat[]>([])
    const getChats = async()=>{
        try {
            const {data} = await axiosClient.get("/chat/all")    
            setChats(data.chats)
        } catch (error) {
            console.error(error);            
        }
    }
    useEffect(()=>{getChats()},[])    
    return <>
        <ul className="list-unstyled chat-list mt-2 mb-0">
            {chats.map((chat)=>{
                return <Chat key={chat.id} {...{chat, active:activeId===chat.id,setActiveChat,setActiveId}}/>
            })}
        </ul>
    </>
}

export default ChatsList