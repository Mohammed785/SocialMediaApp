import {Message} from "@prisma/client"

export interface IMessage {
    id: number;
    content: string;
    createTime: string;
    senderId: number;
}

export interface ServerToClientEvents {
    test: (msg: string) => void;
    error: (msg: string) => void;
    receiveMsg: (msg: Message) => void;
    receiveFriendRequest: (name: string) => void;
    acceptedFriendRequest:(name:string)=>void;
}

export interface ClientToServerEvents {
    setToken: (token: string) => void;
    connectUser: (userId: number) => void;
    sendMsg: (to: number, msg: Message) => void;
    sendFriendRequest: (to: number, name: string) => void;
    acceptFriendRequest:(to:number,name:string)=>void;
}