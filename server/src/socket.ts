import {Server,Socket} from "socket.io"
import { ClientToServerEvents, ServerToClientEvents } from "./@types/socket"

class Connection {
    io: Server<ClientToServerEvents, ServerToClientEvents>;
    socket: Socket<ClientToServerEvents, ServerToClientEvents>;
    constructor(
        io: Server<ClientToServerEvents, ServerToClientEvents>,
        socket: Socket<ClientToServerEvents, ServerToClientEvents>
    ) {
        this.io = io;
        this.socket = socket;
    }
    sendMsg(to:number,msg:string){

    }
    
}

export default function setSocket(io:Server){
    io.on("connection",(socket)=>{
        new Connection(io,socket)
    })
}