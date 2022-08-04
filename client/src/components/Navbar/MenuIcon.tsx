import { FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../../axiosClient";
import { useAuthContext } from "../../context/authContext";
import { useSocketContext } from "../../context/socketContext";
import FriendRequests from "./FriendRequests";
import Notifications from "./Notifications";

function MenuIcon() {
    const {logoutUser} = useAuthContext()!
    const navigator = useNavigate()
    const {user} = useAuthContext()!
    const {socket} = useSocketContext()
    async function handleLogout(){
        try {
            await axiosClient.post("/auth/logout")
            logoutUser()
            socket?.close()
            navigator("/login",{replace:true})
        } catch (error) {
            console.error(error);
            
        }
    }
    return <>
        <div className="col d-flex align-items-center justify-content-end">
            <div title="Profile" className="align-items-center justify-content-center d-none d-xl-flex">
                <Link to={`/profile/${user!.id}`}>
                    <img src={process.env.REACT_APP_STATIC_PATH+user!.profileImg} className="rounded-circle me-2"
                        alt="avatar" style={{width: "38px", height: "38px" ,objectFit: "cover"}} />
                </Link>
            </div>
            <Notifications/>
            <FriendRequests/>
            <div className="bg-gray-dark rounded-circle p-1 bg-gray d-flex align-items-center justify-content-center mx-2" style={{ width: "38px", height: "38px" }} typeof="button" id="notMenu" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">
                <FaSignOutAlt title="Logout" type="button" onClick={handleLogout}></FaSignOutAlt>
            </div>
        </div>
    </>
}

export default MenuIcon