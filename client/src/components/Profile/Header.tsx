import "./profile.css"
import Relation from "./Relation"
import { NavLink, useSearchParams } from "react-router-dom"
import { IUser } from "../../@types/auth"
import { IFriendRequest, IRelation } from "../../@types/relation"

interface IHeaderProps{
    id:number
    relations: { relation: IRelation[], request: IFriendRequest | null }
    info:IUser
}

function Header({ id, relations, info }: IHeaderProps){
    const [queryParams, setQueryParams] = useSearchParams()
    const page = queryParams.get("p")
    return <>
        <header className="shadow bg-dark">
            <img className="cover-img pointer shadow" src={`${process.env.REACT_APP_STATIC_PATH}${info.coverImg}`} alt="profile-cover" />
            <img className="profile-img rounded-circle pointer shadow" src={`${process.env.REACT_APP_STATIC_PATH}${info.profileImg}`} alt="profile-img"/>
            <div className="user-info text-white">
                <h4 className="profile-name">{info.firstName} {info.lastName}</h4>
                <p className="m-0">{info.bio}</p>
            </div>
            <div style={{ height: "1px", backgroundColor: "black", width: "80%" }}></div>
            <nav className="d-flex justify-content-between w-100 mt-2">
                <ul className="list-group list-group-horizontal m-auto">
                    <NavLink to="" className={({ isActive }) => !page ? "mx-2 item pointer active-item" :"mx-2 item pointer bg-gray-dark"}>
                        Timeline
                    </NavLink>
                    <NavLink to="?p=friends" className={({ isActive }) => page === 'friends' ? "mx-2 item pointer active-item" : "mx-2 item pointer bg-gray-dark"}>
                        Friends
                    </NavLink>
                    <NavLink to="?p=about" className={({ isActive }) => page==='about' ? "mx-2 item pointer active-item" : "mx-2 item pointer bg-gray-dark"}>
                        About
                    </NavLink>
                </ul>
                <Relation {...{id,relations}}/>
            </nav>
        </header></>
}

export default Header