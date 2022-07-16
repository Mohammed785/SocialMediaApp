import axios from "axios";
import { FormEvent, useRef } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../../axiosClient";
import useFormFields from "../../hooks/useFormChange";
import { setFormMSG } from "../../utils";
import "./auth.css";

function ResetPasswordForm(){
    const {token} = useParams()
    const [passwords,setPasswords] = useFormFields({password:"",confirmPass:""})
    const errorCont = useRef(null)
    async function handleSubmit(e:FormEvent){
        e.preventDefault()
        try {
            const res = await axiosClient.post(`/auth/resetPassword/${token}`,{...passwords})
            console.log(res);
            setFormMSG(errorCont.current!,res.data.msg, false);
        } catch (error) {
            if(axios.isAxiosError(error)){
                let msg = (error.response?.data as Record<string, any>).message;
                msg = (msg==="jwt malformed")?"Invalid Token Try Resend Reset Email Again":msg
                setFormMSG(errorCont.current!,msg)
            }
        }
    }
    return <>
    <form onSubmit={handleSubmit}>
            <div className="form-group">
                <div className="alert text-wrap" style={{maxWidth:"25rem"}} ref={errorCont} role="alert">
                </div>
            </div>
            <h1 className="h3 mb-3 fw-normal">Reset Password</h1>
            <div className="form-floating">
                <input type="password" name="password" value={passwords.password} onChange={setPasswords} className="form-control" id="password" required placeholder="New Password"/>
                <label htmlFor="password">New Password</label>
            </div>
            <div className="form-floating">
                <input type="password" name="confirmPass" value={passwords.confirmPass} onChange={setPasswords} className="form-control" id="confirmPass" required placeholder="Confirm Password"/>
                <label htmlFor="confirmPass">confirm Password</label>
            </div>
            <button className="w-100 btn btn-lg mb-3 btn-primary" type="submit">Change</button>
            <p className="mt-3 mb-3 text-muted">©{new Date().getFullYear()}</p>
        </form>
    </>
}

export default ResetPasswordForm;