import { NavLink, useSearchParams } from "react-router-dom"
import { IGroup, IGroupMembership, IGroupRequest } from "../../@types/group"
import { useAuthContext } from "../../context/authContext"
import GroupActions from "./GroupActions"
interface IGroupHeaderProps {
    group: IGroup,
    membership: { member: IGroupMembership | false, request: IGroupRequest|false }|null,
    setMember: (o: { member: IGroupMembership | false, request: IGroupRequest|false } | null) => void
}

function GroupHeader({ group, membership, setMember }:IGroupHeaderProps){
    const [queryParams, setQueryParams] = useSearchParams()
    const page = queryParams.get("p")
    const {user} = useAuthContext()!
    return <>
        <header className="shadow bg-dark" style={{position:"relative"}}>
            <img className="cover-img pointer shadow" src={process.env.REACT_APP_STATIC_PATH + group.image} alt="group-img" style={{top: "9%",position: "relative"}} />
            <div style={{position: "relative",top: "5%",width: "100%",display: "flex",flexDirection: "column",alignItems: "center"}}>
                <div className="user-info text-white">
                    <h4 className="profile-name">{group.name}</h4>
                    <p className="text-white">{group.description}</p>
                </div>
                <div style={{ height: "1px", backgroundColor: "black", width: "80%" }}></div>
                <nav className="d-flex justify-content-between align-items-center w-100 mt-2">
                    <ul className="list-group list-group-horizontal m-auto">
                        <NavLink to="" className={({ isActive }) => !page ? "mx-2 item pointer active-item" : "mx-2 item pointer bg-gray-dark"}>
                            Posts
                        </NavLink>
                        <NavLink to="?p=members" className={({ isActive }) => page === "members" ? "mx-2 item pointer active-item" : "mx-2 item pointer bg-gray-dark"}>
                            Members
                        </NavLink>
                        {
                            (group.private && user?.id === group.creatorId) && <NavLink to="?p=requests" className={({ isActive }) => page === "requests" ? "mx-2 item pointer active-item" : "mx-2 item pointer bg-gray-dark"}>
                                Requests
                            </NavLink>
                        }
                        {
                            group.creatorId === user!.id && <NavLink to="?p=info" className={({ isActive }) => page === "info" ? "mx-2 item pointer active-item" : "mx-2 item pointer bg-gray-dark"}>
                            info
                        </NavLink>
                        }
                    </ul>
                    <GroupActions group={group} setMember={setMember} membership={membership}/>
                </nav>
            </div>
        </header>
    </>
}

export default GroupHeader