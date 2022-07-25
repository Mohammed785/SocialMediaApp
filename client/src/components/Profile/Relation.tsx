import axios from "axios";
import { useEffect, useState } from "react";
import { FaUserPlus, FaUserTimes, FaUserSlash } from "react-icons/fa"
import axiosClient from "../../axiosClient";
import { useAuthContext } from "../../context/authContext";

function Relation({ id, relations }: { id: number, relations: Record<string, any> }){
    const {user} = useAuthContext()!
    const [relationState,setRelationState] = useState({block:false,friend:false,sent:false})
    const isFriend = ()=>{
        if(user!.id!==id){
            relations.relation.forEach((friend:{friend:boolean,userId:number})=>{
                if (friend.friend){
                    setRelationState({sent:false,block:false,friend:true})
                }else if(friend.userId===user!.id && !friend.friend){
                    setRelationState({sent:false,block:true,friend:false})
                }
            })
            if (relations.request && Object.hasOwn(relations.request,"senderId")){
                setRelationState({ sent: true, block: true, friend: false })
            }
        }
    }
    const handleRequest = async(type:"send"|"cancel")=>{
        try {
            await axiosClient.post(`/relation/request/${type}/${id}`)
            setRelationState({sent:type==="send",block:false,friend:false})
        } catch (error) {
            if(axios.isAxiosError(error)){
                if((error.response!.data as Record<string,any>).code==="P2002"){
                    // already set request
                }
            }
            console.error(error);
        }
    }
    const handleBlock = async(type:"block"|"unblock")=>{
        try {
            await axiosClient.post(`/relation/${type}/${id}`)
            if(type==="block")setRelationState({sent:false,block:true,friend:false})
            else setRelationState({ sent:false,block: false, friend: false })
        } catch (error) {
            console.error(error);
        }
    }
    const removeFriend = async()=>{
        try {
            await axiosClient.post(`/relation/unfriend/${id}`)
            setRelationState({ sent:false,block: false, friend: false })
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(()=>isFriend(),[relations])
    return <>
    {user!.id!==id &&
        <ul className="list-group list-group-horizontal m-auto">
            {(relationState.friend)?<li className="item">
                    <button className="btn btn-primary" onClick={removeFriend}><FaUserTimes /> Remove Friend</button>
                </li>
            : (relationState.sent) ? <li className="item">
                <button className="btn btn-primary" onClick={async()=>{await handleRequest("cancel")}}><FaUserPlus /> Cancel Friend Request</button>
                </li>
            :<li className="item">
                <button className="btn btn-primary" onClick={async()=>{await handleRequest("send")}}><FaUserPlus /> Send Friend Request</button>
            </li>}
            {(relationState.block) ? <li className="item">
                    <button className="btn btn-danger" onClick={async () => { await handleBlock("unblock") }}><FaUserTimes />Remove Block</button>
            </li>
                :<li className="item">
                    <button className="btn btn-danger" onClick={async()=>{await handleBlock("block")}}><FaUserSlash />Block</button>
                </li>
            }
        </ul>
    }
    </>
}

export default Relation;