import axios from "axios"
import { useState,FormEvent, useRef } from "react"
import { Link } from "react-router-dom"
import axiosClient from "../../axiosClient"
import "./auth.css"
function ForgetPasswordForm(){
    const [email,setEmail] = useState("")
    const errorCont = useRef<HTMLDivElement>(null)
    function setMsg(msg:string,isError=true){
        if(true){
            errorCont.current?.classList.remove("alert-danger")
            errorCont.current?.classList.remove("alert-success");
        }
        (isError)? errorCont.current?.classList.add("alert-danger")
            : errorCont.current?.classList.add("alert-success");
        errorCont.current!.innerText = msg
    }
    const handleSubmit=async(e:FormEvent)=>{
        e.preventDefault()
        try {
            const res = await axiosClient.post("/auth/forgetPassword",{email})
            setMsg(res.data.msg,false)
        } catch (error) {
            if(axios.isAxiosError(error)){
                setMsg((error.response?.data as Record<string,any>).message)
            }
        }
    }
    return <>
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <div className="alert text-wrap" style={{display:"block",maxWidth:"25rem"}} ref={errorCont} role="alert">
                </div>
            </div>
            <h1 className="h3 mb-3 fw-normal text-white">Find My Account</h1>
            <div className="form-floating">
                <input type="email" name="email" id="email" className="form-control inp" value={email} onChange={(e)=>{setEmail(e.target.value)}} placeholder="Email address"/>
                <label htmlFor="email">Email:</label>
            </div>
            <button className="w-100 btn btn-lg mb-3 btn-primary" type="submit">Find</button>
        </form>
        <Link to="/login" className="btn btn-secondary w-100">Login</Link>
    </>
}

export default ForgetPasswordForm