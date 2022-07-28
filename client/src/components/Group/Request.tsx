import axiosClient from "../../axiosClient";

function Request({request,removeRequest}:{request:Record<string,any>,removeRequest:Function}){
    const handleRequest = async(type:"accept"|"decline")=>{
        try {
            const {data} = await axiosClient.delete(`/group/${request.groupId}/request/${request.sender.id}/${type}`)
            console.log(data);            
            removeRequest(request.sender.id)
        } catch (error) {
            console.error(error);            
        }
    }
    return <>
        <li className="list-group-item d-flex align-items-center justify-content-between my-1 shadow member-rounded p-2">
            <div className="member-info">
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