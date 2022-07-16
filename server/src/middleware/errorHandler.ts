import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime";
import { ErrorRequestHandler } from "express";
import { MulterError } from "multer";
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
        CustomError.code = err.code
        if(err.code==="P2025"){
            CustomError.message = "Record to update not found.";
            CustomError.statusCode = 400;
        }else if(err.code==="P2021"){
            CustomError.message = (process.env.NODE_ENV==="dev")
            ?"The table `StatusView` does not exist in the current database"
            :"Something Went Wrong Try Again Later"
        }else if(err.code==="P1017"){
            CustomError.message = "Server has closed the connection.";
        }else if(err.code==="P2002"){
            CustomError.message = "Value Is Not Unique.";
            CustomError.statusCode = 500
        }
        else if(err.code==="P2013"){
            CustomError.message = "Required Values Are Missing.";
            CustomError.statusCode = 500;
        }else if(err.code==="P2003"){
            const name = err.meta!.field_name as string
            CustomError.message = `${name.slice(0,-2)} Not Found`;
            CustomError.statusCode = 404;
        }else{
            CustomError.message = "Something Went Wrong"
            CustomError.statusCode = 500
        }
        CustomError.meta = err.meta
    }else if(err instanceof PrismaClientValidationError){
        CustomError.message = "Invalid Arguments";
    }
    else if(err instanceof MulterError){
        CustomError.code = err.code
        CustomError.message = err.message
        CustomError.meta = err.field
    }
    return res.status(CustomError.statusCode).json({ 
        ...CustomError
    });
};