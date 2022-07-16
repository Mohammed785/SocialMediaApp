import ResetPasswordForm from "../components/Auth/ResetPassword";
import useTitle from "../hooks/useTitle";

function ResetPassword(){
    useTitle("ResetPassword",true)
    return <>
        <ResetPasswordForm/>
    </>
}

export default ResetPassword