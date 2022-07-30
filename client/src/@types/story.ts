import { IUser } from "./auth"

export interface IStory{
    id:number
    image:string
    caption:string
    author:IUser
}