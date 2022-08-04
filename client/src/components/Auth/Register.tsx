import axios from "axios"
import React, { useRef } from "react"
import {Link} from "react-router-dom"
import useFormChange from "../../hooks/useFormChange"
import axiosClient from "../../axiosClient"
import "./auth.css"
import { setFormMSG } from "../../utils"

function RegisterForm(){
    const [info,setInfo] = useFormChange({firstName:"",lastName:"",email:"",password:"",confirmPassword:"",gender:"",birthDate:""})
    const errorCont = useRef<HTMLDivElement>(null)
    const handleSubmit = async(e:React.FormEvent)=>{
        e.preventDefault()
        try {
            info.gender = (info.gender==="male")?true:false;
            const res = await axiosClient.post("/auth/register",{...info})
            setFormMSG(errorCont.current!,"User Created Successfully,Try To Login",false)
        } catch (error) {
            if(axios.isAxiosError(error)){
                if((error.response?.data as Record<string,any>).code==="P2002"){
                    setFormMSG(errorCont.current!,"User Already Exists Try Login")
                }else{
                    setFormMSG(errorCont.current!,(error.response?.data as Record<string,any>).message)
                }
            }
        }
    }
    return <>
    <form onSubmit={handleSubmit}>
            <h1 className="h3 mb-3 fw-normal text-white">Register</h1>
            <div className="form-group">
                <div className="alert text-wrap" style={{maxWidth:"38rem"}} ref={errorCont} role="alert">
                </div>
            </div>
            <div className="form-group row">
                <div className="col">
                    <div className="form-floating">
                        <input type="text" name="firstName" value={info.firstName} onChange={setInfo} className="form-control inp" id="firstName" placeholder="First name" required/>
                        <label htmlFor="firstName">First name</label>
                    </div>
                </div>
                <div className="col">
                    <div className="form-floating">
                        <input type="text" name="lastName" value={info.lastName} onChange={setInfo} className="form-control inp" id="lastName" placeholder="First name" required/>
                        <label htmlFor="lastName">Last name</label>
                    </div>
                </div>
            </div>
            <div className="form-floating">
                <input type="email" name="email" value={info.email} onChange={setInfo} className="form-control inp" id="email" placeholder="Email" required/>
                <label htmlFor="email">Email address</label>
            </div>
            <div className="form-group row">
                <div className="col">
                    <div className="form-floating">
                        <input type="password" value={info.password} name="password" onChange={setInfo} className="form-control inp" id="password" placeholder="Password" required/>
                        <label htmlFor="password">Password</label>
                    </div>
                </div>
                <div className="col">
                    <div className="form-floating">
                        <input type="password" value={info.confirmPassword} name="confirmPassword" onChange={setInfo} className="form-control inp" id="confirmPassword" placeholder="Confirm password" required/>
                        <label htmlFor="confirmPassword">Confirm password</label>
                    </div>
                </div>
            </div>
            <div className="form-group row">
                <div className="col">
                    <div className="form-check from-check-inline col">
                        <input className="form-check-input inp" onChange={setInfo} type="radio" name="gender" id="g-m" value="male" required/>
                        <label className="form-check-label" htmlFor="g-m">Male</label>
                    </div>

                </div>
                <div className="col">
                    <div className="form-check from-check-inline">
                        <input className="form-check-input inp" onChange={setInfo} type="radio" name="gender" id="g-f" value="female" required/>
                        <label className="form-check-label" htmlFor="g-f">Female</label>
                    </div>

                </div>
            </div>
            <div className="form-group mb-2" style={{textAlign:"start"}}>
                <label htmlFor="birthDate" className="form-label me-3">Birth date: </label>
                <input type="date" value={info.birthDate} onChange={setInfo} className="form-control" name="birthDate" id="birthDate"  required/>
            </div>
            <button className="w-100 mt-3 btn btn-lg mb-3 btn-primary" type="submit">Register</button>
            {<Link to="/login" className="btn btn-outline-secondary">Already have account?</Link>}
            <p className="mt-3 mb-3 text-white" style={{ color: "white" }}>©{new Date().getFullYear()}</p>
        </form>
    </>
}

export default RegisterForm;

