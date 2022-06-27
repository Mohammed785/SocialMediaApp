import { config } from "dotenv"
config()
import express from "express"
import "express-async-errors"
import { urlencoded } from "body-parser"
import cookieParser from "cookie-parser"
import { authRouter } from "./routes/auth"
import { join } from "path"
import { postRouter } from "./routes/post"
import { authMiddleware,errorHandler } from "./middleware"
import { commentRouter } from "./routes/comment"



const app = express()
app.use(express.json())
app.use(urlencoded({extended:false}))
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(express.static(join(__dirname,"public")))
app.use("/api/v1/post",authMiddleware,postRouter)
app.use("/api/v1/comment",authMiddleware,commentRouter)
app.use("/api/v1/auth",authRouter)
app.use(errorHandler)

app.use(async(req:express.Request,res:express.Response)=>{
    return res.status(404).send("Not Found!!");
})


const start = async()=>{
    try {
        const port = process.env.PORT
        app.listen(port, () => console.log(`[SERVER] Listen On Port ${port}`));
    } catch (error) {
        console.error(error)
    }
}

start()
