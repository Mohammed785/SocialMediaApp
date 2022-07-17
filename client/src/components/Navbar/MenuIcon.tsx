import { UIEvent, useState } from "react";
import { FaBell, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../../axiosClient";

function MenuIcon() {
    const [notificationState,setNotificationState] = useState({notSeen:0,cursor:0,notifications:[]})
    const navigator = useNavigate()
    const loadNotification = async()=>{
        try {
            const response = await axiosClient.get(`/notification/?cursor=${notificationState.cursor}`)
            console.log(response);
            const { notifications,cursor} = response.data
            const notSeen = notifications.reduce((prev:number,curr:any)=>{
                if(curr.seen===false) return prev+1
                return prev
            },0) 
            setNotificationState({ notSeen, notifications: notifications.concat(notificationState.notifications),cursor})
        } catch (error) {
            console.log(error);
        }
    }
    const markAllRead = async()=>{
        try {
            const ids = notificationState.notifications.filter((notifi:any)=>notifi.seen==false).map((noti:any)=>noti.id)
            const response = await axiosClient.patch("/notification/seen",{ids})
            const notifications = notificationState.notifications.map((noti: any) => { return { ...noti, seen: true } })
            setNotificationState({ ...notificationState, notSeen: 0, notifications:(notifications as never[]) })
        } catch (error) {
            console.error(error);
        }
    }
    const handleNotificationsScroll = async(e:UIEvent)=>{
        if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop <= e.currentTarget!.clientHeight && notificationState.cursor!==0){
            await loadNotification()
        }
    }
    async function handleLogout(){
        try {
            const response = await axiosClient.post("/auth/logout")
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
            <div className="dropdown me-1 rounded-circle p-1 bg-gray d-flex align-items-center justify-content-center mx-2" style={{ width: "38px", height: "38px" }} typeof="button" id="notMenu" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">
                <FaBell className="dropdown-toggle" onClick={loadNotification} type="button" id="notificationDropdown" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false"></FaBell>
                <ul onScroll={handleNotificationsScroll}  className="dropdown-menu navbar-nav-scroll dropdown-menu-dark" style={{overflowX:"hidden"}} aria-labelledby="notificationDropdown">
                    <li className="head text-light ">
                        <div className="row">
                            <div className="col-lg-12 col-sm-12 col-12 bg-dark" style={{display: "flex",alignItems:"center",justifyContent: "space-between"}}>
                                <span>Notifications ({notificationState.notSeen})</span>
                                <button onClick={markAllRead} className="float-right text-light btn btn-link">Mark all as read</button>
                            </div>
                        </div>
                    </li>
                    {notificationState.notifications && notificationState.notifications.map((noti:{id: number;content: string;createTime: string;action?: string;seen: boolean;})=>{
                        return <Notification {...noti}/>
                    })}
                    <li className="footer bg-dark text-center">
                        <Link to="/notification/all" className="text-light">View All</Link>
                    </li>
                </ul>
            </div>
            <div className="rounded-circle p-1 bg-gray d-flex align-items-center justify-content-center mx-2" style={{ width: "38px", height: "38px" }} typeof="button" id="notMenu" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">
                <FaSignOutAlt type="button" onClick={handleLogout}></FaSignOutAlt>
            </div>
        </div>
    </>
}
function Notification({ id, content, createTime, action, seen }: { id: number, content: string, createTime: string, action?: string, seen: boolean }) {
    return <>
        <li className={(seen) ? "notification-box" : "notification-box not-seen"} key={id} >
            <div className="row">
                <div className="col-lg-3 col-sm-3 col-3 text-center">
                    <img src="" className="w-50 rounded-circle" />
                </div>
                <div className="col-lg-8 col-sm-8 col-8">
                    {/* <strong className="text-info">David John</strong> */}
                    <div>
                        {content}
                    </div>
                    <small className="text-warning">{createTime}</small>
                </div>
            </div>
        </li>
    </>
}
export default MenuIcon