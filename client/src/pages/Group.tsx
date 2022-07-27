import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import axiosClient from "../axiosClient"
import GroupHeader from "../components/Group/GroupHeader"
import GroupMembers from "../components/Group/GroupMemebers"
import GroupPosts from "../components/Group/GroupPosts"
import PostForm from "../components/Home/Post/PostForm"
import "../components/Group/group.css"

function Group() {
    const {id} = useParams()
    const [group,setGroup] = useState<Record<string,any>>({})
    const [membership, setMembership] = useState(null)
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
                const { data: { member } } = await axiosClient.get(`/group/${id}/member`)
                setMembership(member)
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
                <GroupPosts id={parseInt(id!)} />
            </div>
        </div>
    }
    {page==='members' && <GroupMembers group={group}/>}
    </>
}

export default Group