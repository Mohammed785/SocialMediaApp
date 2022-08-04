import { config } from "dotenv"
config()
import express from "express"
import "express-async-errors"
import cookieParser from "cookie-parser"
import { authRouter } from "./routes/auth"
import { join } from "path"
import { postRouter } from "./routes/post"
import { authMiddleware,errorHandler } from "./middleware"
import { commentRouter } from "./routes/comment"
import { relationRouter } from "./routes/relation"
import { statusRouter } from "./routes/status"
import { groupRouter } from "./routes/group"
import { notificationRouter } from "./routes/notifications"
import { userRouter } from "./routes/user"
import cors from "cors";
import { chatRouter } from "./routes/chat"
import { createClient } from "redis"
import {createServer} from "http"
import { Server } from "socket.io"
import { ClientToServerEvents, ServerToClientEvents } from "./@types/socket"
const app = express()
const redisClient = createClient()

const server = createServer(app)
const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
    cors: { origin: true },
});


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(cors({credentials:true,origin:true}))
app.use("/static",express.static(join(__dirname,"..","public")))
app.use("/api/v1/post",authMiddleware,postRouter)
app.use("/api/v1/comment",authMiddleware,commentRouter)
app.use("/api/v1/relation",authMiddleware,relationRouter)
app.use("/api/v1/status",authMiddleware,statusRouter)
app.use("/api/v1/group",authMiddleware,groupRouter)
app.use("/api/v1/notification",authMiddleware,notificationRouter)
app.use("/api/v1/user",authMiddleware,userRouter)
app.use("/api/v1/chat",authMiddleware,chatRouter)
app.use("/api/v1/auth",authRouter)
app.use(errorHandler)

app.use(async(req:express.Request,res:express.Response)=>{
    return res.status(404).send("Not Found!!");
})

io.on("connection",(socket)=>{
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
    socket.on("disconnect",()=>{
        redisClient.del(String(socket.data.userId)).then((value)=>{
        })
    })
    console.log(socket.id);
    
})


const start = async()=>{
    try {
        const port = process.env.PORT
        redisClient.on("error",(err)=>console.log("REDIS: ",err))
        await redisClient.connect()
        server.listen(port, () => console.log(`[SERVER] Listen On Port ${port}`));
    } catch (error) {
        console.error(error)
    }
}

start()
