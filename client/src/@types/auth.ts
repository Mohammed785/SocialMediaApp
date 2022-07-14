export interface IUser {
    id:number;
    fullName:string;
    email:string;
}

export type AuthContextType = {
    user:IUser|null;
    token:string|null;
    setToken:(token:string)=>void;
    loginUser:(user:IUser)=>void;
    logoutUser:()=>void;
}