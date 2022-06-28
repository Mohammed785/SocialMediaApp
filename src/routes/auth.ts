import { RequestHandler, Router } from "express"
import { JsonWebTokenError } from "jsonwebtoken";
import { CreateUserDTO, LoginDTO } from "../@types/user";
import { BadRequestError, NotFoundError } from "../errors";
import { authMiddleware, validationMiddleware } from "../middleware";
import { attachCookie, comparePasswords, createJWT, hashPassword, 
    prisma, serializeUser, StatusCodes, transporter, verifyJWT } from "../utils"

export const authRouter = Router();

const login:RequestHandler = async (req,res) => {
    const {email,password} = req.body;
    const user = await prisma.user.findUnique({where:{email}});
    if(!user){
        throw new BadRequestError("Wrong Credentials");
    }
    if (!(await comparePasswords(password, user.password))) {
        throw new BadRequestError("Wrong Credentials.");
    }
    const serializedUser = serializeUser(user)
    const token = attachCookie(res,serializedUser)
    return res.status(StatusCodes.ACCEPTED).json({msg:"Logged in Successfully",token})
}

const register:RequestHandler = async (req, res) => {
    let user = await prisma.user.findUnique({where:{email:req.body.email}});
    if(user){
        return res.status(StatusCodes.BAD_REQUEST).json({msg:"User Already Exists"});
    }
    req.body.birthDate = new Date(req.body.birthDate)
    req.body.password = await hashPassword(req.body.password)
    user = await prisma.user.create({data:{...req.body}});
    return res.status(StatusCodes.CREATED).json({msg:"User Created Successfully"});
}

const logout:RequestHandler = async (req, res) => {
    await prisma.user.update({where:{id:req.user?.id},data:{lastSeen:new Date()}})
    res.cookie("token","logged out",{
        httpOnly:true,
        expires:new Date(Date.now()+2500)
    });
    return res.status(StatusCodes.OK).json({msg:"Logged out"});
}

const forgetPassword:RequestHandler = async (req, res) => {
    const {email} = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if(!user){
        throw new NotFoundError("User Not Found Check Your Email And Try Again");
    }
    const token = createJWT({id:user.id,email:user.email});
    const mailOption = {
        from: process.env.MASTER_MAIL,
        to: email,
        subject: "Reset Your Password",
        html: `<a href="http://localhost:${process.env.PORT}/api/v1/auth/resetPassword/${token}" target="_blank" style="display: inline-block;text-decoration: none;color: #FFFFFF; background-color: #18163a; border-radius: 1px;">
      <span style="display:block;padding:15px 40px;line-height:120%;"><span style="font-size: 18px; line-height: 21.6px;">Reset Password</span></span></a>`,
    };
    transporter.sendMail(mailOption,(err,info)=>{
        if(err){
            console.error(err);
            throw new BadRequestError("Email Sent Failed Check Your Email And Try Again")
        }else{
            console.log("Sent "+info.response);
        }
    })
    return res.status(StatusCodes.ACCEPTED).json({msg:"Rest Link Sent To Your Email"})
}

const resetPassword:RequestHandler = async (req,res) => {
    const token = req.params.token   
    const {newPass,confirmPass} = req.body
    const verifiedToken = verifyJWT(token)
    if(!verifiedToken){
        throw new JsonWebTokenError("Invalid Token")
    }
    if(!newPass || !confirmPass || newPass!==confirmPass){
        throw new BadRequestError("Confirm Password Must Equal New Password.")
    }
    const user = await prisma.user.update({where:{id:verifiedToken.id},data:{password:await hashPassword(newPass)}},)
    if(!user){
        throw new NotFoundError("User Not Found.")
    }
    return res.status(StatusCodes.ACCEPTED).json({msg:"Password Changed Successfully"})
}


const changePassword:RequestHandler = async (req,res)=>{
    const {oldPass,newPass,confirmPass} = req.body
    const user = await prisma.user.findUnique({where:{id:req.user?.id}})
    if(!await comparePasswords(oldPass,user!.password)){
        throw new BadRequestError("Wrong Old Password")
    }
    if(newPass!==confirmPass){
        throw new BadRequestError("New Password Must Equal Confirm Password")
    }
    const hashed = await hashPassword(newPass)
    await prisma.user.update({where:{id:req.user?.id},data:{password:hashed}})
    return res.status(StatusCodes.ACCEPTED).json({msg:"Password Updated Successfully"})
}

const deleteAccount:RequestHandler = async(req,res)=>{
    const user = await prisma.user.delete({where:{id:req.user?.id}})
    return res.json({msg:`${req.user?.fullName} Your Account has Deleted`})
}

const updateProfile:RequestHandler = async(req,res)=>{
    const user = await prisma.user.update({where:{id:req.user?.id},
        data:req.body,select:{password:false}})
    return res.status(StatusCodes.ACCEPTED).json({msg:"Profile Updated Successfully",user})
}

authRouter.post("/login",validationMiddleware(LoginDTO),login)
authRouter.post("/register",validationMiddleware(CreateUserDTO),register)
authRouter.post("/logout",authMiddleware,logout)
authRouter.post("/forgetPassword",forgetPassword)
authRouter.post("/resetPassword/:token",resetPassword)
authRouter.patch("/changePassword",authMiddleware,changePassword)
authRouter.patch("/account/update",authMiddleware,updateProfile)
authRouter.delete("/account/delete",authMiddleware,deleteAccount)
