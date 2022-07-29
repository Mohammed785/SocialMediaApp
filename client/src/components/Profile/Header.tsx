import "./profile.css"
import Relation from "./Relation"
import { NavLink, useSearchParams } from "react-router-dom"

function Header({ id, relations, info }: { id: number, relations: Record<string, any>, info: Record<string, any> }){
    const [queryParams, setQueryParams] = useSearchParams()
    const page = queryParams.get("p")
    return <>
        <header className="shadow bg-white">
            <img className="cover-img pointer shadow" src={`${process.env.REACT_APP_STATIC_PATH}${info.coverImg}`} alt="profile-img" />
            <img className="profile-img rounded-circle pointer shadow" src={`${process.env.REACT_APP_STATIC_PATH}${info.profileImg}`} alt="d" />
            <div className="user-info">
                <h4 className="profile-name">{info.firstName} {info.lastName}</h4>
                <p className="text-muted">{info.bio}</p>
            </div>
            <div style={{ height: "1px", backgroundColor: "black", width: "80%" }}></div>
            <nav className="d-flex justify-content-between w-100 mt-2">
                <ul className="list-group list-group-horizontal m-auto">
                    <NavLink to="" className={({ isActive }) => !page ? "mx-2 item pointer active-item" :"mx-2 item pointer"}>
                        Timeline
                    </NavLink>
                    <NavLink to="?p=friends" className={({ isActive }) => page === 'friends' ? "mx-2 item pointer active-item" : "mx-2 item pointer"}>
                        Friends
                    </NavLink>
                    <NavLink to="?p=about" className={({ isActive }) => page==='about' ? "mx-2 item pointer active-item" : "mx-2 item pointer"}>
                        About
                    </NavLink>
                </ul>
                <Relation {...{id,relations}}/>
            </nav>
        </header></>
}

export default Header