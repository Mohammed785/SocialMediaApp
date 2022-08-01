import toast from "react-hot-toast";
import { IGroupRequest } from "../../@types/group";
import axiosClient from "../../axiosClient";

interface IRequestProps{
    request: IGroupRequest;
    removeRequest:(id:number)=>void
}

function Request({request,removeRequest}:IRequestProps){
    const handleRequest = async(type:"accept"|"decline")=>{
        try {
            await axiosClient.delete(`/group/${request.groupId}/request/${request.sender.id}/${type}`)
            removeRequest(request.sender.id)
            toast.success(`request ${type}`)
        } catch (error) {
            console.error(error);            
        }
    }
    return <>
        <li className="list-group-item d-flex bg-gray-dark align-items-center justify-content-between my-1 shadow member-rounded p-2">
            <div className="member-info text-muted">
                <img className="rounded-circle" src={`${process.env.REACT_APP_STATIC_PATH}${request.sender.profileImg}`} alt="" />
                <p style={{fontSize:"20px",margin:0}}>{request.sender.firstName} {request.sender.lastName}</p>
            </div>
            <div>
                <button className="btn btn-success mx-1" onClick={async()=>{await handleRequest("accept")}}>Accept Request</button>
                <button className="btn btn-danger mx-1" onClick={async()=>{await handleRequest("decline")}}>Cancel Request</button>
            </div>
        </li>
    </>
}

export default Request