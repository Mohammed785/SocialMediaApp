import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../../context/authContext";

function RequireAuth({children}:{children:JSX.Element}){
    const {user} = useAuthContext()!
    const location = useLocation()
    if(!user){
        return <Navigate to="/login" state={{from:location}} replace />
    }
    return children
}

export default RequireAuth