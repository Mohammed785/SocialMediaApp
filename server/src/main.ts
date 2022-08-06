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
import {createServer} from "http"
import { Server } from "socket.io"
import { ClientToServerEvents, ServerToClientEvents } from "./@types/socket"
import { redisClient, setSocket } from "./socket"

const app = express()

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

const start = async()=>{
    try {
        const port = process.env.PORT
        redisClient.on("error",(err)=>console.log("REDIS: ",err))
        await redisClient.connect()
        setSocket(io)
        server.listen(port, () => console.log(`[SERVER] Listen On Port ${port}`));
    } catch (error) {
        console.error(error)
    }
}

start()
