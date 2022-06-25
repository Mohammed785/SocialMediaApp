import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { ErrorRequestHandler } from "express";
import { StatusCodes } from "../utils";

export const errorHandler: ErrorRequestHandler = async (err, req, res, next) => {
    const CustomError:Record<string,any> = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        message: err.message || "Something Went Wrong Try Again Later",
        meta:"",
        code:"",
        url:req.url,
        time:new Date().toLocaleString()
    };
    if(err instanceof PrismaClientKnownRequestError){
        CustomError.meta = err.meta
        CustomError.code = err.code
    }
    return res.status(CustomError.statusCode).json({ 
        ...CustomError
    });
};