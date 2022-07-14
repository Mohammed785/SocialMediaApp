import React, { useRef } from "react"
import {Link, useLocation, useNavigate} from "react-router-dom"
import axios from "axios"
import { useAuthContext } from "../../context/authContext"

type LocationProps = {
  state: {
    from: Location;
  };
};


function LoginForm(){
    const [info,setInfo] = React.useState({email:"",password:""})
    const errorCont = useRef<HTMLHeadingElement>(null)
    const {loginUser,setToken} = useAuthContext()!
    const navigate = useNavigate()
    const location = useLocation() as LocationProps
    const handleChange = (e:React.ChangeEvent)=>{
        const name = (e.target! as HTMLInputElement).name
        const val = (e.target! as HTMLInputElement).value
        setInfo({...info,[name]:val})
    }
    const handleSubmit = async(e:React.FormEvent)=>{
        e.preventDefault()
        try {
            const res = await axios.post("http://localhost:8000/api/v1/auth/login",{...info},{headers:{"Content-Type":"application/json"},withCredentials:true})
            const token = `Bearer ${res.data.token}`;
            setToken(token)
            loginUser(res.data.user)
            navigate(location.state?.from?.pathname || "/",{replace:true})
        } catch (error) {
            if(axios.isAxiosError(error)){
                if(error.response?.status===400){
                    errorCont.current!.style!.display = "block"
                    errorCont.current!.innerText = (error.response?.data as Record<string,any>).message
                }
            }
        }        
    }
    return <>
    <form onSubmit={handleSubmit}>
            <div className="form-group">
                <div className="alert alert-danger text-wrap" style={{display:"none",maxWidth:"30rem"}} ref={errorCont} role="alert">
                </div>
            </div>
            <h1 className="h3 mb-3 fw-normal">Please sign in</h1>
            <div className="form-floating">
                <input type="email" name="email" value={info.email} onChange={handleChange} className="form-control" id="floatingInput" required placeholder="name@example.com"/>
                <label htmlFor="floatingInput">Email address</label>
            </div>
            <div className="form-floating">
                <input type="password" name="password" value={info.password} onChange={handleChange} className="form-control" id="floatingPassword" required placeholder="Password"/>
                <label htmlFor="floatingPassword">Password</label>
            </div>
    
            <div className="form-group mb-2">
                {<Link to="/forget-password" className="btn btn-link">Forget password?</Link>}
            </div>
            <button className="w-100 btn btn-lg mb-3 btn-primary" type="submit">Sign in</button>
            {<Link to="/register" className="btn btn-outline-secondary">Need Account?</Link>}
            <p className="mt-3 mb-3 text-muted">©{new Date().getFullYear()}</p>
        </form>
    </>
}

export default LoginForm;

