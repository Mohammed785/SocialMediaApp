import React, { useRef } from "react"
import {Link, useLocation, useNavigate} from "react-router-dom"
import axios from "axios"
import { useAuthContext } from "../../context/authContext"
import useFormFields from "../../hooks/useFormChange";
import axiosClient from "../../axiosClient";
import "./auth.css"
import { setFormMSG } from "../../utils";

type LocationProps = {
  state: {
    from: Location;
  };
};


function LoginForm(){
    const [info,setInfo] = useFormFields({email:"",password:""})
    const errorCont = useRef<HTMLDivElement>(null)
    const {loginUser} = useAuthContext()!
    const navigate = useNavigate()
    const location = useLocation() as LocationProps
    const handleSubmit = async(e:React.FormEvent)=>{
        e.preventDefault()
        try {
            const res = await axiosClient.post("/auth/login",{...info})
            loginUser(res.data.user)
            navigate(location.state?.from?.pathname || "/",{replace:true})
        } catch (error) {
            if(axios.isAxiosError(error)){
                setFormMSG(errorCont.current!,(error.response?.data as Record<string,any>).message)
            }
        }
    }
    return <>
    <form className="bg-dark" onSubmit={handleSubmit}>
            <div className="form-group">
                <div className="alert text-wrap" style={{maxWidth:"30rem"}} ref={errorCont} role="alert">
                </div>
            </div>
            <h1 className="h3 mb-3 fw-normal" style={{color:"white"}}>Please sign in</h1>
            <div className="form-floating">
                <input type="email" name="email" value={info.email} onChange={setInfo} className="form-control inp" id="email" required placeholder="Email address"/>
                <label htmlFor="email">Email address</label>
            </div>
            <div className="form-floating">
                <input type="password" name="password" value={info.password} onChange={setInfo} className="form-control inp" id="password" required placeholder="Password"/>
                <label htmlFor="password">Password</label>
            </div>
    
            <div className="form-group mb-2">
                {<Link to="/forgetPassword" className="btn btn-link">Forget password?</Link>}
            </div>
            <button className="w-100 btn btn-lg mb-3 btn-primary" type="submit">Sign in</button>
            {<Link to="/register" className="btn btn-outline-secondary">Need Account?</Link>}
            <p className="mt-3 mb-3 text-white" style={{color:"white"}}>©{new Date().getFullYear()}</p>
        </form>
    </>
}

export default LoginForm;

