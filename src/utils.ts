import { PrismaClient,User } from "@prisma/client"
import { hash,compare,genSalt } from "bcrypt"
import { Response } from "express"
import { JwtPayload, sign,verify } from "jsonwebtoken"
import { createTransport } from "nodemailer"
import smtpTransport  from "nodemailer-smtp-transport"
import multer from "multer"
import { extname, join, resolve } from "path"
import { BadRequestError } from "./errors"
import sharp from "sharp"

export const prisma = new PrismaClient()

export const userSelect = {
    id: true,
    firstName: true,
    lastName: true,
    email: true,
    password: false,
};
export const serializeUser = (user:User)=>{
    return {
        id:user.id,
        email:user.email,
        fullName:`${user.firstName} ${user.lastName}`
    }
}

export const createJWT = (payload:object)=>{
    return sign(payload,process.env.JWT_SECRET!,{expiresIn:process.env.JWT_LIFETIME})
}

export const verifyJWT = (token:string)=>{
    return verify(token,process.env.JWT_SECRET!) as JwtPayload
}


export const comparePasswords = async (plain:string,hashed:string)=>{
    return await compare(plain,hashed);
}

export const hashPassword = async (password:string)=>{
    const salt = await genSalt(10)
    const hashed = await hash(password,salt)
    return hashed
}

export const attachCookie = (res:Response,user:object)=>{
    const token = createJWT(user);
    const day = 1000*60*60*24;
    res.cookie("token",token,{
        signed:true,
        httpOnly:true,
        expires:new Date(Date.now()+day),
        secure:process.env.NODE_ENV==='production'
    });
    return token
}

export const transporter = createTransport(smtpTransport({
    service: "gmail",
    auth: {
        user: process.env.MASTER_MAIL,
        pass: process.env.MASTER_MAIL_Password,
    }
}))

const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null,join(__dirname, "..", "/src/public/uploads"));
    },
    filename(req, file, callback) {
        const ext = extname(file.originalname)
        const uniqueName = `${file.fieldname}-${Date.now()}${Math.round(Math.random() * 1e9)}${ext}`;
        callback(null,uniqueName);
    },
})

export const uploader = multer({
    storage,
    limits: { fileSize: 4 * 1024 * 1024 },
    fileFilter(req, file, callback) {
        if (file.mimetype == "image/png" ||file.mimetype == "image/jpg" ||
            file.mimetype == "image/jpeg") {
            callback(null, true);
        }else{
            callback(null,false);
            return callback(
                new BadRequestError("Only .png, .jpg and .jpeg format allowed!")
            );
        }
    },
});

export const resizeImage = async(path:string,name:string,dest:string,maxWidth=1200,maxHeight=630)=>{
    sharp.cache(false);
    const meta = await sharp(path).metadata()
    const ratio=Math.min(maxWidth / meta.width!, maxHeight / meta.height!)||1;    
    sharp(await sharp(path)
        .resize(Math.round(ratio * meta.width!), Math.round(ratio * meta.height!))
        .toFormat("jpeg",{force:true})
        .jpeg({ quality: 85})
        .toBuffer()).toFile(resolve(dest,name))
}

export const createNotification = async (receiverId:number,content:string,action:string|null=null) => {
    return await prisma.notification.create({
        data: {
            receiverId,
            content,
            action
        },
    });
};

export enum StatusCodes {
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    PAYMENT_REQUIRED = 402,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    METHOD_NOT_ALLOWED = 405,
    REQUEST_TIMEOUT = 408,
    TOO_MANY_REQUESTS = 429,
    INTERNAL_SERVER_ERROR = 500,
    BAD_GATEWAY = 502,
}