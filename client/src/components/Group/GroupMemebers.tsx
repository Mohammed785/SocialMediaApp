import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom"
import { IGroupMembership } from "../../@types/group";
import axiosClient from "../../axiosClient";
import { useAuthContext } from "../../context/authContext";

interface IGroupMembers {
    members:IGroupMembership[]
    count: number
}

function GroupMembers({id,creatorId}:{id:number,creatorId:number}) {
    const [members,setMembers] = useState<IGroupMembers>({members:[],count:0})
    const {user} = useAuthContext()!
    const getMembers = async ()=>{
        try {            
            const {data:{count,members}} = await axiosClient.get(`/group/${id}/member/all`)
            setMembers({members,count})
        } catch (error) {
            console.error(error);            
        }
    }
    const kickMember = async(id:number)=>{
        try {
            await axiosClient.delete(`/group/${id}/member/${id}/kick`)
            const membersL = members.members.filter((mem:IGroupMembership) => mem.user.id !== id)
            setMembers({members:membersL,count:membersL.length})
            toast.success("member kicked")
        } catch (error) {
            console.error(error);            
        }
    }
    useEffect(()=>{
        id && getMembers()
    },[id])
    return <>
    <div className="col-lg-8 d-flex flex-column justify-content-center my-3 bg-dark p-2">
            <ul className="list-group w-100 my-2">
                <h3 className="text-center">{members.count} Members</h3>
                {
                    members.members.map((member)=>{
                        return <li key={member.user.id} className="list-group-item bg-gray-dark d-flex align-items-center justify-content-between my-1 shadow member-rounded p-2">
                            <div className="member-info">
                                <img className="rounded-circle" src={`${process.env.REACT_APP_STATIC_PATH}${member.user.profileImg}`} alt="" />
                                <Link to={`/profile/${member.user.id}`}>
                                    <p>{member.user.firstName} {member.user.lastName}</p>
                                </Link>
                            </div>
                            <div className="d-flex align-items-center">
                            <h5>{!member.isAdmin ?"Member":(member.user.id===creatorId)?"Creator":"Member"}</h5>
                            {(user!.id===creatorId&&user!.id!==member.user.id)&&
                            <button className="btn btn-danger ms-2" onClick={async()=>{await kickMember(member.user.id)}}>Kick</button>}
                            </div>
                        </li>
                    })
                }
            </ul>
    </div>
    </>
}

export default GroupMembers