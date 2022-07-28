import { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import axiosClient from "../../axiosClient";
import { useAuthContext } from "../../context/authContext";
import image from "../img.jpg"

interface IGroupMembers {
    members:Record<string,any>[]
    count: number
}

function GroupMembers({group}:{group:Record<string,any>}) {
    const [members,setMembers] = useState<IGroupMembers>({members:[],count:0})
    const {user} = useAuthContext()!
    const getMembers = async ()=>{
        try {            
            const {data:{count,members}} = await axiosClient.get(`/group/${group.id}/member/all`)
            setMembers({members,count})
        } catch (error) {
            console.error(error);            
        }
    }
    const kickMember = async(id:number)=>{
        try {
            const {data} = await axiosClient.delete(`/group/${group.id}/member/${id}/kick`)
            const membersL = members.members.filter((mem:Record<string,any>) => mem.user.id !== id)
            setMembers({members:membersL,count:membersL.length})
        } catch (error) {
            console.error(error);            
        }
    }
    useEffect(()=>{
        group.id && getMembers()
    },[group])
    return <>
    <div className="col-lg-8 d-flex flex-column justify-content-center my-3 bg-white shadow p-2">
            <ul className="list-group w-100 my-2">
                <h3 className="text-center">{members.count} Members</h3>
                {
                    members.members.map((member)=>{
                        return <li key={member.user.id} className="list-group-item d-flex align-items-center justify-content-between my-1 shadow member-rounded p-2">
                            <div className="member-info">
                                <img className="rounded-circle" src={`${process.env.REACT_APP_STATIC_PATH}${member.user.profileImg}`} alt="" />
                                <Link to={`/profile/${member.user.id}`}>
                                    <p>{member.user.firstName} {member.user.lastName}</p>
                                </Link>
                            </div>
                            <div className="d-flex align-items-center">
                            <h5>{!member.isAdmin ?"Member":(member.user.id===group.creatorId)?"Creator":"Member"}</h5>
                            {(user!.id===group.creatorId&&user!.id!==member.user.id)&&
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