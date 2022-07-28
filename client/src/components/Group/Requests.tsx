import { useEffect, useState } from "react"
import axiosClient from "../../axiosClient";
import Request from "./Request";

function Requests({group}:{group:Record<string,any>}) {
    const [requests,setRequests] = useState([])
    const getRequests = async()=>{
        try {
            const {data} = await axiosClient.get(`/group/${group.id}/request/all`)
            setRequests(data.requests)
        } catch (error) {
            console.error(error);            
        }
    }
    const removeRequest = (userId:number)=>{
        setRequests(requests.filter((req:Record<string,any>)=>req.sender.id!==userId))
    }
    useEffect(()=>{
        getRequests()
    },[])
    return <>
        <div className="col-lg-8 d-flex flex-column justify-content-center my-3 bg-white shadow p-2">
            <ul className="list-group w-100 my-2">
                {        
                    requests.map((request:Record<string,any>)=>{                        
                        return <Request key={request.sender.id} {...{request,removeRequest}}/>
                    })
                }
            </ul>
        </div>
    </>
}

export default Requests