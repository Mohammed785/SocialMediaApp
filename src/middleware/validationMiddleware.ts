import {plainToInstance} from "class-transformer"
import {validate,ValidationError} from "class-validator"
import { RequestHandler } from "express"
import { BadRequestError } from "../errors"

export function validationMiddleware<T>(type:any,skipMissingProperties=false):RequestHandler{
    return (req,res,next)=>{
        validate(plainToInstance(type,req.body),{skipMissingProperties})
        .then((errors:ValidationError[])=>{
            if(errors.length>0){
                const msg = errors.map((err:ValidationError)=>
                `${Object.values(err.constraints as Object)}`).join(",")
                next(new BadRequestError(msg))
            }
            next()
        })
    }    
}