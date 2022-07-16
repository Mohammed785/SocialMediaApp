import RegisterForm  from "../components/Auth/Register"
import useTitle from "../hooks/useTitle"
function Register(){
    useTitle("Register",true)
    return <>
    <RegisterForm/>
    </>
}

export default Register;

