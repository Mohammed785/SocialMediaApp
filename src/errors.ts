import { StatusCodes } from "./utils";

export class CustomError extends Error {
    statusCode: number;
    constructor(message: string) {
        super(message);
    }
}

export class NotFoundError extends CustomError {
    constructor(message: string) {
        super(message);
        this.statusCode = StatusCodes.NOT_FOUND;
    }
}

export class BadRequestError extends CustomError {
    constructor(message: string) {
        super(message);
        this.statusCode = StatusCodes.BAD_REQUEST;
    }
}

export class NotAuthenticatedError extends CustomError {
    constructor(message: string) {
        super(message);
        this.statusCode = StatusCodes.UNAUTHORIZED;
    }
}
export class ForbiddenError extends CustomError {
    constructor(message: string) {
        super(message);
        this.statusCode = StatusCodes.FORBIDDEN;
    }
}
