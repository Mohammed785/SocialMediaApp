import React from "react"
import RegisterForm  from "../components/Auth/Register"
import "../components/Auth/auth.css"
import useTitle from "../hooks/useTitle"
function Register(){
    useTitle("Register",true)
    return <>
    <RegisterForm/>
    </>
}

export default Register;

