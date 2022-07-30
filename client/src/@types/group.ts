import { IUser } from "./auth";

export interface IGroup{
    id:number;
    name:string;
    image:string;
    description:string;
    creatorId:number;
    private:boolean;
    createTime:string
}

export interface IGroupSearch {
    id: number;
    name: string;
    image: string;
}

export interface IGroupMembership{
    groupId:number;
    userId:number;
    isAdmin:boolean
    user:IUser
    group:IGroup
}

export interface IGroupRequest{
    groupId:number;
    senderId:number;
    sender:IUser
}