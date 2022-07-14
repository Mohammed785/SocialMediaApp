import React from "react"
import LoginForm  from "../components/Auth/Login"
import "../components/Auth/auth.css"
function Login(){
    React.useEffect(()=>{
        document.title = "Login"
        document.getElementById("root")?.classList.add("form-signin","w-100","m-auto")
        document.querySelector("body")?.classList.add("text-center")
    }
    ,[])
    return <>
        <LoginForm/>
    </>
}

export default Login;

