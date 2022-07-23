import { RequestHandler } from "express";
import { NotAuthenticatedError } from "../errors";
import { verifyJWT } from "../utils";

export const authMiddleware: RequestHandler = (req, res, next) => {
    let token;
    const authHeader = req.headers.authorization
    if( authHeader && authHeader.startsWith("Bearer")){
        token = authHeader.split(" ")[1]
    }else if(req.signedCookies.token){
        token = req.signedCookies.token
    }else{
        throw new NotAuthenticatedError("You Need To Login First")
    }
    try {
        const payload = verifyJWT(token)
        req.user = {
            id:payload.id,
            email:payload.email,
            firstName:payload.firstName,
            lastName:payload.lastName
        }
        next()
    } catch (error) {
        throw new NotAuthenticatedError("Authentication Failed Try Again");
    }

};