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
    acceptedFriendRequest: (name: string) => void;
    reactedOn: (msg: string) => void;
    commentedOnPost: (msg: string) => void;
}

export interface ClientToServerEvents {
    setToken: (token: string) => void;
    connectUser: (userId: number) => void;
    sendMsg: (to: number, msg: Message) => void;
    sendFriendRequest: (to: number, name: string) => void;
    acceptFriendRequest: (to: number, name: string) => void;
    commentOnPost: (to: number, name: string) => void;
    reactOn: (to: number, on: "post" | "comment", name: string,react:string) => void;
}