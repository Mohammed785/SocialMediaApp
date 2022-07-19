import { useState } from "react"
import axiosClient from "../../axiosClient"
import { FaUsers } from "react-icons/fa"

interface IRequest{
    id: number;
    createTime:string;
    sender: {id: number, firstName: string;lastName: string;}
}

function FriendRequests() {
    const [requestState, setRequestState] = useState({ loading: false, requests: [] })
    const loadRequests = async () => {
        try {
            setRequestState({...requestState,loading:true})
            const response = await axiosClient.get("/relation/request")
            setRequestState({loading:false,requests:response.data.requests})
        } catch (error) {
            setRequestState({ ...requestState, loading: false })
            console.error(error);
        }
    }
    const acceptRequest = async(id:number)=>{
        try {
            const response = await axiosClient.post(`/relation/request/accept/${id}`,{})
            setRequestState({...requestState,requests:requestState.requests.filter((req:IRequest)=>{
                return req.sender.id!==id
            })})
        } catch (error) {
            console.error(error);
        }
    }
    const declineRequest = async(id:number)=>{
        try {
            const response = await axiosClient.post(`/relation/request/decline/${id}`,{})
            setRequestState({...requestState,requests:requestState.requests.filter((req:IRequest)=>{
                return req.sender.id!==id
            })})
        } catch (error) {
            console.error(error);
        }
    }
    return <>
        <div className="dropdown me-1 rounded-circle p-1 bg-gray d-flex align-items-center justify-content-center mx-2" style={{ width: "38px", height: "38px" }} typeof="button" id="notMenu" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">
            <FaUsers title="Friend Request" className="dropdown-toggle" onClick={loadRequests} type="button" id="requestDropdown" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false"></FaUsers>
            <ul className="dropdown-menu navbar-nav-scroll dropdown-menu-dark" style={{ overflowX: "hidden" }} aria-labelledby="requestDropdown">
                <li className="head text-light ">
                    <div className="row">
                        <div className="col-lg-12 col-sm-12 col-12 bg-dark" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <span>Requests ({requestState.requests.length})</span>
                        </div>
                    </div>
                </li>
                {requestState.requests && requestState.requests.map((req: IRequest) => {
                    return <Request req={req} declineRequest={declineRequest} acceptRequest={acceptRequest} />
                })}
                <li className="footer bg-dark text-center">
                    <p className="text-light m-0">
                        {requestState.loading ?"Loading":"all"}
                    </p>
                </li>
            </ul>
        </div>
    </>
}
function Request({ req, acceptRequest, declineRequest }: { req: IRequest, acceptRequest: Function, declineRequest: Function }) {
    return <>
        <li className={"notification-box"} key={req.id} >
            <div className="row">
                <div className="col-lg-2 col-sm-2 col-2 text-center">
                    <img src="" className="w-50 rounded-circle" />
                </div>
                <div className="col-lg-7 col-sm-7 col-7">
                    <strong className="text-info">{req.sender.firstName} {req.sender.lastName}</strong>
                    <div>
                        sent you a friend request
                    </div>
                    <small className="text-warning">{req.createTime}</small>
                </div>
                <div className="col-2">
                    <button onClick={()=>{acceptRequest(req.sender.id)}} className="btn btn-info">Accept</button>
                    <button onClick={() => { declineRequest(req.sender.id)}} className="btn btn-danger mt-1">Decline</button>
                </div>
            </div>
        </li>
    </>
}
export default FriendRequests