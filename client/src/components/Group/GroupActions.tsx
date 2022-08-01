import toast from "react-hot-toast"
import { FaBan, FaSignInAlt, FaSignOutAlt } from "react-icons/fa"
import { IGroup, IGroupMembership, IGroupRequest } from "../../@types/group"
import axiosClient from "../../axiosClient"


interface IGroupHeaderProps {
    group: IGroup,
    membership: {member:IGroupMembership | false,request:IGroupRequest|false}|null,
    setMember: (o: { member: IGroupMembership | false, request: IGroupRequest|false } | null) => void
}

function GroupActions({ group, membership, setMember }:IGroupHeaderProps){
    const groupAction = async(type:string)=>{
        try {
            if(type==='leave'){
                await axiosClient.delete(`/group/${group.id}/member/leave`)
                setMember(null)
                toast.success("leaved group")
            }else if(type==="cancel"){
                await axiosClient.delete(`/group/${group.id}/request/cancel`)
                setMember(null)
                toast.success("request canceled")
            }else{
                const { data } = await axiosClient.post(`/group/${group.id}/join`)
                if(group.private){
                    setMember({request:data.request,member:false})
                    toast.success("request sent")
                }else{
                    setMember({member:data.membership,request:false})
                    toast.success("joined the group")
                }
            }
        } catch (error) {
            console.error(error);        
        }
    }
    
    return <>
        <ul className="list-group list-group-horizontal m-auto">
            {(membership&&membership.member) ? <li className="item">
                <button className="btn btn-danger" onClick={async()=>{await groupAction("leave")}}><FaSignOutAlt className="me-2" /> Leave Group</button>
            </li>
                : (membership && membership.request) ? <li className="item">
                    <button className="btn btn-warning" onClick={async () => { await groupAction("cancel") }}><FaBan className="me-2" />Cancel Request</button>
                </li>
                :<li className="item">
                    <button className="btn btn-primary" onClick={async () => { await groupAction("join") }}><FaSignInAlt className="me-2" />Join Group</button>
                </li>
            }
        </ul>
    </>
}

export default GroupActions