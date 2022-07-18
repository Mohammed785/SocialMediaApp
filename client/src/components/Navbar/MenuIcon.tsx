import { FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../../axiosClient";
import { useAuthContext } from "../../context/authContext";
import Notifications from "./Notifications";

function MenuIcon() {
    const {logoutUser} = useAuthContext()!
    const navigator = useNavigate()
    async function handleLogout(){
        try {
            const response = await axiosClient.post("/auth/logout")
            logoutUser()
            navigator("/login",{replace:true})
        } catch (error) {
            console.error(error);
            
        }
    }
    return <>
        <div className="col d-flex align-items-center justify-content-end">
            <div className="align-items-center justify-content-center d-none d-xl-flex">
                <Link to="/profile">
                    <img src="" className="rounded-circle me-2"
                        alt="avatar" style={{width: "38px", height: "38px" ,objectFit: "cover"}} />
                </Link>
            </div>
            <Notifications/>
            <div className="rounded-circle p-1 bg-gray d-flex align-items-center justify-content-center mx-2" style={{ width: "38px", height: "38px" }} typeof="button" id="notMenu" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">
                <FaSignOutAlt type="button" onClick={handleLogout}></FaSignOutAlt>
            </div>
        </div>
    </>
}

export default MenuIcon