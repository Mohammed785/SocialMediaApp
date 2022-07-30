export interface IUser {
    id:number;
    firstName:string;
    lastName:string;
    profileImg:string;
    coverImg:string;
    email:string;
    birthDate:string;
    gender:boolean
    bio:string
}

export interface IUserSearch {
    id: number;
    firstName: string;
    lastName: string;
    profileImg: string;
}

export type AuthContextType = {
    user:IUser|null;
    loginUser:(user:IUser)=>void;
    logoutUser:()=>void;
}