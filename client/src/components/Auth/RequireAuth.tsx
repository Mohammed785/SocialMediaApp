import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../../context/authContext";

function RequireAuth({children}:{children:JSX.Element}){
    const [auth,setAuth] = useState(true)
    const {loginUser,logoutUser} = useAuthContext()!
    const location = useLocation()
    const findMe = async()=>{
        try {
            const me = await axios.get("http://localhost:8000/api/v1/auth/me",{withCredentials:true})
            loginUser(me.data)
            setAuth(true)
        } catch (error) {
            if(axios.isAxiosError(error)){            
                if(error.response!.status===401){
                    logoutUser()
                    setAuth(false)
                }
            }
        }     
    }
    useEffect(()=>{findMe()}
    ,[])
    if(!auth){
        return <Navigate to="/login" state={{from:location}} replace />
    }
    return children
}

export default RequireAuth