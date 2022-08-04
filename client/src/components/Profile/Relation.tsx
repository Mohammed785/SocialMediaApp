import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaUserPlus, FaUserTimes, FaUserSlash } from "react-icons/fa"
import { IFriendRequest, IRelation } from "../../@types/relation";
import axiosClient from "../../axiosClient";
import { useAuthContext } from "../../context/authContext";
import { useSocketContext } from "../../context/socketContext";

interface IRelationProps{
    id:number
    relations: { relation: IRelation[], request: IFriendRequest | null }
}

function Relation({ id, relations }: IRelationProps){
    const {user} = useAuthContext()!
    const [relationState,setRelationState] = useState({block:false,friend:false,sent:false,received:false})
    const {socket} = useSocketContext()
    const isFriend = ()=>{
        if(user!.id!==id){
            relations.relation.forEach((friend)=>{
                if (friend.friend){
                    setRelationState({sent:false,block:false,friend:true,received:false})
                }else if(friend.userId===user!.id && !friend.friend){
                    setRelationState({sent:false,block:true,friend:false,received:false})
                }
            })
            if (relations.request){
                if(relations.request.senderId===user?.id){
                    setRelationState({ sent: true, block: false, friend: false ,received:false})
                }else{
                    setRelationState({ sent: false, block: false, friend: false, received: true })
                }

            }
            
        }
    }
    const handleRequest = async(type:"send"|"cancel"|"accept")=>{
        try {
            await axiosClient.post(`/relation/request/${type}/${id}`)
            setRelationState({ sent: type === "send", block: false, friend: type === "accept",received:false})
            type==="send"&& socket?.emit("sendFriendRequest",id,`${user?.firstName} ${user?.lastName}`)
            type === "accept" && socket?.emit("acceptFriendRequest", id, `${user?.firstName} ${user?.lastName}`)
        } catch (error) {
            if(axios.isAxiosError(error)){
                if((error.response!.data as Record<string,any>).code==="P2002"){
                    toast.error("Already Sent Request")
                }
            }
        }
    }
    const handleBlock = async(type:"block"|"unblock")=>{
        try {
            await axiosClient.post(`/relation/${type}/${id}`)
            if (type === "block") setRelationState({ sent: false, block: true, friend: false, received: false })
            else setRelationState({ sent: false, block: false, friend: false, received: false })
        } catch (error) {
            console.error(error);
        }
    }
    const removeFriend = async()=>{
        try {
            await axiosClient.post(`/relation/unfriend/${id}`)
            setRelationState({ sent: false, block: false, friend: false, received: false })
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(()=>isFriend(),[relations])
    return <>
    {user!.id!==id &&
        <ul className="list-group list-group-horizontal m-auto">
            {(relationState.friend)?<li className="item">
                    <button className="btn btn-danger" onClick={removeFriend}><FaUserTimes /> Remove Friend</button>
                </li>
            :(relationState.sent) ? <li className="item">
                <button className="btn btn-warning" onClick={async()=>{await handleRequest("cancel")}}><FaUserPlus /> Cancel Friend Request</button>
                </li>
            : (relationState.received) ? <li className="item">
                <button className="btn btn-success" onClick={async () => { await handleRequest("accept") }}><FaUserPlus /> Accept Friend Request</button>
            </li>
            :<li className="item">
                <button className="btn btn-primary" onClick={async()=>{await handleRequest("send")}}><FaUserPlus /> Send Friend Request</button>
            </li>
            }
            {(relationState.block) ? <li className="item">
                    <button className="btn btn-warning" onClick={async () => { await handleBlock("unblock") }}><FaUserTimes />Remove Block</button>
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