import React from "react"
import LoginForm  from "../components/Auth/Login"
import "../components/Auth/auth.css"
import useTitle from "../hooks/useTitle"
function Login(){
    useTitle("Login",true)
    return <>
        <LoginForm/>
    </>
}

export default Login;

