import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import axiosClient from "../axiosClient"
import GroupHeader from "../components/Group/GroupHeader"
import GroupMembers from "../components/Group/GroupMemebers"
import GroupPosts from "../components/Group/GroupPosts"
import PostForm from "../components/Home/Post/PostForm"
import GroupInfo from "../components/Group/GroupInfo"
import "../components/Group/group.css"
import Requests from "../components/Group/Requests"
import useTitle from "../hooks/useTitle"
import { IGroup, IGroupMembership, IGroupRequest } from "../@types/group"

function Group() {
    useTitle("Group")
    const {id} = useParams()
    const [group,setGroup] = useState<IGroup>({} as IGroup)
    const [membership, setMembership] = useState<{member:IGroupMembership|false,request:IGroupRequest|false}|null>(null)
    const [queryParams, setQueryParams] = useSearchParams()
    const page = queryParams.get("p")
    useEffect(()=>{
        const getGroup = async()=>{
            try {
                const {data:{group}} = await axiosClient.get(`/group/${id}`)
                setGroup(group)
            } catch (error) {
                console.error(error);                
            }
        }
        const checkMember = async () => {
            try {
                const { data: { member,request } } = await axiosClient.get(`/group/${id}/member`)
                setMembership({member,request})
            } catch (error) {
                console.error(error);
            }
        }
        getGroup()
        checkMember()
    },[id])
    return <>
    <GroupHeader group={group} setMember={setMembership} membership={membership}/>
        {!page && <div className="col-12 col-lg-6 pb-5">
            <div className="d-flex flex-column justify-content-center w-100 mx-auto" style={{ paddingTop: "56px", maxWidth: "680px" }}>
                <PostForm groupId={group.id}/>
                {(!group.private || membership?.member)&&<GroupPosts id={parseInt(id!)}/>}
            </div>
        </div>
    }
    {page==='members' && <GroupMembers {...{id:group.id,creatorId:group.creatorId}}/>}
    {page==="info" && <GroupInfo group={group} setGroup={setGroup}/>}
    {(page==="requests"&&group.private)&&<Requests id={group.id}/>}
    </>
}

export default Group