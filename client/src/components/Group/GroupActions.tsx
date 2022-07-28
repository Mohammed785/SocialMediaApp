import { FaBan, FaSignInAlt, FaSignOutAlt } from "react-icons/fa"
import axiosClient from "../../axiosClient"

function GroupActions({ group, membership, setMember }: { group: Record<string,any>, membership: Record<string, any> | null, setMember:Function }){
    const groupAction = async(type:string)=>{
        try {
            if(type==='leave'){
                const {data:{membership}} = await axiosClient.delete(`/group/${group.id}/member/leave`)
                setMember(null)
            }else if(type==="cancel"){
                const { data } = await axiosClient.delete(`/group/${group.id}/request/cancel`)
                setMember(null)
            }else{
                const { data } = await axiosClient.post(`/group/${group.id}/join`)
                if(group.private){
                    setMember({request:data.request,membership:false})
                }else{
                    setMember({membership:data.membership,request:false})
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