import { IUser } from "./auth";

export interface IFriendRequest{
    id: number;
    createTime:string;
    senderId?: number
    sender:IUser
}

export interface IRelation{
    friend:boolean
    related:IUser
    relatedId:number
    userId:number
}

