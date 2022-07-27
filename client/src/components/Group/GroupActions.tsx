import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa"
import axiosClient from "../../axiosClient"
import { useAuthContext } from "../../context/authContext"

function GroupActions({ group, membership, setMember }: { group: Record<string,any>, membership: Record<string, any> | null, setMember:Function }){
    const {user} = useAuthContext()!
    const groupAction = async(type:string)=>{
        try {
            if(type==='leave'){
                const {data:{membership}} = await axiosClient.delete(`/group/${group.id}/member/leave`)
                setMember(null)
            }else{
                const { data: { membership } } = await axiosClient.post(`/group/${group.id}/join`)
                setMember(membership)
            }
        } catch (error) {
            console.error(error);        
        }
    }
    
    return <>
        <ul className="list-group list-group-horizontal m-auto">
            {(membership) ? <li className="item">
                <button className="btn btn-danger" onClick={async()=>{await groupAction("leave")}}><FaSignOutAlt className="me-2" /> Leave Group</button>
            </li>
                :<li className="item">
                    <button className="btn btn-primary" onClick={async () => { await groupAction("join") }}><FaSignInAlt className="me-2" />Join Group</button>
                </li>
            }
            
        </ul>
    </>
}

export default GroupActions