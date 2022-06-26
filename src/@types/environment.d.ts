declare global{
    namespace Express{
        interface Request{
            user?:{
                id:int,
                email:string,
                fullName:string
            }
        }
    }
}


export {}