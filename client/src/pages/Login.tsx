import LoginForm  from "../components/Auth/Login"
import useTitle from "../hooks/useTitle"
function Login(){
    useTitle("Login",true)
    return <>
        <LoginForm/>
    </>
}

export default Login;

