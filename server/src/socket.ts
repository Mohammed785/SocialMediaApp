import {Server,Socket} from "socket.io"
import { ClientToServerEvents, ServerToClientEvents } from "./@types/socket"
import { createClient } from "redis";

export const redisClient = createClient();

class Connection {
    io: Server<ClientToServerEvents, ServerToClientEvents>;
    socket: Socket<ClientToServerEvents, ServerToClientEvents>;
    constructor(
        io: Server<ClientToServerEvents, ServerToClientEvents>,
        socket: Socket<ClientToServerEvents, ServerToClientEvents>
    ) {
        this.io = io;
        this.socket = socket;
        socket.on("connectUser",(userId)=>{
            socket.data.userId = userId
            redisClient.set(userId.toString(),socket.id).then((value)=>{
                //
            })
        })
        socket.on("sendMsg",(to,msg)=>{
            if (socket.data?.userId) {
                redisClient.get(to.toString()).then((id) => {
                    if (id) {
                        socket.to(id).emit("receiveMsg", msg);
                    }
                });
            }
        })
        socket.on("sendFriendRequest",(to,name)=>{
            if (socket.data?.userId){            
                redisClient.get(to.toString()).then((id) => {
                    if (id) {
                        socket.to(id).emit("receiveFriendRequest", `${name} Sent Friend Request`);
                    }
                });
            }
        })
        socket.on("acceptFriendRequest",(to,name)=>{
            if (socket.data?.userId){            
                redisClient.get(to.toString()).then((id) => {
                    if (id) {
                        socket.to(id).emit("acceptedFriendRequest", `${name} Accepted Friend Request`);
                    }
                });
            }
        });
        socket.on("commentOnPost",(to,name)=>{
            if(socket.data?.userId && to!==socket.data?.userId){
                redisClient.get(to.toString()).then((id)=>{
                    if(id){
                        socket.to(id).emit("commentedOnPost",`${name} Commented On Your Post`)
                    }
                })
            }
        })
        socket.on("reactOn",(to,on,name,react)=>{
            if(socket.data?.userId && to!==socket.data?.userId){
                redisClient.get(to.toString()).then((id)=>{
                    if(id){
                        socket.to(id).emit("reactedOn",`${name} ${react} your ${on}`)
                    }
                })
            }
        })
        socket.on("disconnect",()=>{
            redisClient.del(String(socket.data.userId)).then((value)=>{
            })
        })
    }
    
}

export function setSocket(io:Server){
    io.on("connection",(socket)=>{
        new Connection(io,socket)
    })
}