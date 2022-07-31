import { useEffect, useState } from "react"
import { IGroupRequest } from "../../@types/group";
import axiosClient from "../../axiosClient";
import Request from "./Request";

function Requests({id}:{id:number}) {
    const [requests,setRequests] = useState<IGroupRequest[]>([])
    const getRequests = async()=>{
        try {
            const {data} = await axiosClient.get(`/group/${id}/request/all`)
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
        <div className="col-lg-8 d-flex flex-column justify-content-center my-3 bg-dark shadow p-2">
            <ul className="list-group w-100 my-2">
                {        
                    requests.map((request:IGroupRequest)=>{                        
                        return <Request key={request.sender.id} {...{request,removeRequest}}/>
                    })
                }
            </ul>
        </div>
    </>
}

export default Requests