import { IUser } from "./auth"

export interface IChat{
    id:number,
    active:boolean,
    user1Id:number,
    user2Id:number,
    user1:IUser,
    user2:IUser
}

export interface IMessage{
    id:number,
    content:string,
    createTime:string,
    senderId:number
}