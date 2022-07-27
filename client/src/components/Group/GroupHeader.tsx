import { NavLink, useSearchParams } from "react-router-dom"
import GroupActions from "./GroupActions"

function GroupHeader({ group, membership, setMember }: { group: Record<string, any>, membership: Record<string, any> | null, setMember:Function }){
    const [queryParams, setQueryParams] = useSearchParams()
    const page = queryParams.get("p")
    return <>
        <header className="shadow bg-white" style={{position:"relative"}}>
            <img className="cover-img pointer shadow" src={"http://localhost:8000" + group.image} alt="group-img" style={{top: "9%",position: "relative"}} />
            <div style={{position: "relative",top: "5%",width: "100%",display: "flex",flexDirection: "column",alignItems: "center"}}>
                <div className="user-info">
                    <h4 className="profile-name">{group.name}</h4>
                    <p className="text-muted">{group.description}</p>
                </div>
                <div style={{ height: "1px", backgroundColor: "black", width: "80%" }}></div>
                <nav className="d-flex justify-content-between align-items-center w-100 mt-2">
                    <ul className="list-group list-group-horizontal m-auto">
                        <NavLink to="" className={({ isActive }) => !page ? "mx-2 item pointer active-item" : "mx-2 item pointer"}>
                            Posts
                        </NavLink>
                        <NavLink to="?p=members" className={({ isActive }) => page==="members" ? "mx-2 item pointer active-item" : "mx-2 item pointer"}>
                            Members
                        </NavLink>
                        <NavLink to="?p=requests" className={({ isActive }) => page==="requests" ? "mx-2 item pointer active-item" : "mx-2 item pointer"}>
                            Requests
                        </NavLink>
                        <NavLink to="?p=info" className={({ isActive }) => page === "info" ? "mx-2 item pointer active-item" : "mx-2 item pointer"}>
                            info
                        </NavLink>
                    </ul>
                    <GroupActions group={group} setMember={setMember} membership={membership}/>
                </nav>

            </div>
        </header>
    </>
}

export default GroupHeader