import { createElement } from "react"
import { IconType } from "react-icons";
import { FaBookmark, FaFacebookMessenger, FaHome, FaUsers } from "react-icons/fa";
import { NavLink } from "react-router-dom";
function LinkIcon() {
    
    return <>
        <div className="col d-none d-xl-flex justify-content-center">
            <CustomNavLink to="/" tooltip="Home" icon={FaHome}></CustomNavLink>
            <CustomNavLink to="/chat" tooltip="Chat" icon={FaFacebookMessenger}></CustomNavLink>
            <CustomNavLink to="/posts/saved" tooltip="Saved Posts" icon={FaBookmark}></CustomNavLink>
        </div>
    </>;
}

function CustomNavLink({to,tooltip,icon}:{to:string,tooltip:string,icon:IconType}){
    return <>
        <NavLink to={to} className={({ isActive }) => isActive ? "mx-4 nav__btn nav__btn-active" :"mx-4 nav__btn"} >
            <button data-bs-toggle="tooltip" title={tooltip} type="button" className="btn px-4">
                {
                    createElement(icon, { className:"text-muted fs-4",type:"button"})
                }
            </button>
    </NavLink>
    </>
}

export default LinkIcon;
