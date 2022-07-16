import ForgetPasswordForm from "../components/Auth/ForgetPassword"
import useTitle from "../hooks/useTitle"
function ForgetPassword(){
    useTitle("ForgetPassword",true)
    return <>
        <ForgetPasswordForm/>
    </>
}

export default ForgetPassword