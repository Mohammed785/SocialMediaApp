import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import {useAuthContext} from "./authContext"
import { io } from "socket.io-client"
import toast from "react-hot-toast";

interface ISocketContext {
    socket:Socket|null;
    setSocket:(socket:Socket|null)=>void
}

const SocketContext = createContext<ISocketContext>({socket:null,setSocket:(socket)=>{}})

function SocketProvider({children}:{children:ReactNode}){
    const {user} = useAuthContext()!
    const [socket, setSocket] = useState<Socket | null>(io("http://localhost:8000"))
    const sendError = (msg:string)=>toast.error(msg)
    const sendMsg = (msg:string)=>{toast(msg,{className:"bg-info text-white"});}
    useEffect(()=>{
        user && socket?.emit("connectUser",user.id)
        socket?.on("error",sendError)
        socket?.on("receiveFriendRequest",sendMsg)
        socket?.on("acceptedFriendRequest",sendMsg)
        return () => { socket?.off("error", sendError); socket?.off("receiveFriendRequest",sendMsg)}
    },[socket,user])
    return <SocketContext.Provider value={{socket,setSocket}}>
        {children}
    </SocketContext.Provider>
}

function useSocketContext(){
    return useContext(SocketContext)
}

export {useSocketContext,SocketProvider}