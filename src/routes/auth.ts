import { Request, Response, Router } from "express"
import { JsonWebTokenError } from "jsonwebtoken";
import { CreateUserDTO, LoginDTO } from "../@types/user";
import { BadRequestError, NotFoundError } from "../errors";
import { authMiddleware } from "../middleware/authMiddleware";
import { validationMiddleware } from "../middleware/validationMiddleware";
import { attachCookie, comparePasswords, createJWT, hashPassword, 
    prisma, serializeUser, StatusCodes, transporter, verifyJWT } from "../utils"

export const authRouter = Router();

const login = async (req:Request,res:Response) => {
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

const register = async (req: Request, res: Response) => {
    let user = await prisma.user.findUnique({where:{email:req.body.email}});
    if(user){
        return res.status(StatusCodes.BAD_REQUEST).json({msg:"User Already Exists"});
    }
    req.body.birthDate = new Date(req.body.birthDate)
    req.body.password = await hashPassword(req.body.password)
    user = await prisma.user.create({data:{...req.body}});
    return res.status(StatusCodes.CREATED).json({msg:"User Created Successfully"});
}

const logout = async (req: Request, res: Response) => {
    res.cookie("token","logged out",{
        httpOnly:true,
        expires:new Date(Date.now()+2500)
    });
    return res.status(StatusCodes.OK).json({msg:"Logged out"});
}

const forgetPassword = async (req: Request, res: Response) => {
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

const resetPassword = async (req: Request, res: Response) => {
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

authRouter.post("/login",validationMiddleware(LoginDTO),login)
authRouter.post("/register",validationMiddleware(CreateUserDTO),register)
authRouter.post("/logout",authMiddleware,logout)
authRouter.post("/forgetPassword",forgetPassword)
authRouter.post("/resetPassword/:token",resetPassword)
