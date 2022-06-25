import { PrismaClient,User } from "@prisma/client"
import { hash,compare,genSalt } from "bcrypt"
import { Response } from "express"
import { JwtPayload, sign,verify } from "jsonwebtoken"
import { createTransport } from "nodemailer"
import smtpTransport  from "nodemailer-smtp-transport"

export const prisma = new PrismaClient()

export const serializeUser = (user:User)=>{
    return {
        id:user.id,
        email:user.email
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