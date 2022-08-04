import axios from "axios";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

const axiosClient = axios.create({
    baseURL:"http://localhost:8000/api/v1",
    withCredentials:true
})
const errorStyle = {
    backgroundColor: "#8d0404",
    color: "#fff"
}

export function AxiosError(){
    const navigate = useNavigate()
    const location = useLocation()
    useEffect(()=>{
        const interceptor = axiosClient.interceptors.response.use((response)=>response,(error)=>{
            if(axios.isAxiosError(error)){
                const errorData = error.response?.data as Record<string, any>
                if(errorData.statusCode===401){
                    navigate("/login",{state:{from:location},replace:true})
                }else if(errorData.statusCode===404){
                    console.log("REDIRECT");                  
                    navigate("/404")
                }else if(errorData.statusCode===500){
                    toast.error(errorData.message, { style: { backgroundColor:"#8d0404",color:"#fff"}})
                    return Promise.reject({msg:errorData.message,status:500})
                } else if (errorData.statusCode === 400){
                    if(errorData.code==="P2002"){
                        toast.error("Already Exists", { style:errorStyle })
                    }
                    toast.error(errorData.message, { style: errorStyle })
                    return Promise.reject({ msg: errorData.message, status: 400,code:errorData.code })
                }
                toast.error(errorData.message, { style: errorStyle })
                return Promise.reject(error)
            }
        }) 
        return ()=>axiosClient.interceptors.response.eject(interceptor)
    },[])
    return <></>
}


export default axiosClient