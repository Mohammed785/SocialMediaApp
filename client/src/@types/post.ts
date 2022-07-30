import { IUser } from "./auth";

export interface IPost {
    id: number;
    body: string;
    edited: boolean;
    createTime: string;
    commentable: boolean;
    private:boolean;
    images: IPostImage[];
    reactions: IPostReaction[];
    author: IUser;
    _count: { comments: number };
}

export interface IPostReaction{
    reaction:boolean;
    user:IUser;
}

export interface IPostImage{
    id:number;
    image:string;
    description:string
}

export interface IComment{
    id:number;
    edited:boolean;
    body:string;
    createdTime:string;
    postId:number;
    author:IUser;
    reactions:ICommentReaction[]
    _count:{comments:number}
    updateTime:string
}

export interface ICommentReaction {
    reaction: boolean;
    user: IUser;
}

