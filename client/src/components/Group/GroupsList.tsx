import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { IGroupMembership } from "../../@types/group"
import axiosClient from "../../axiosClient"

interface IGroupList{
    cursor:number
    groups:IGroupMembership[]
}

function GroupsList() {
    const [list,setList] = useState<IGroupList>({cursor:0,groups:[]})
    const getUserGroups = async()=>{
        try {
            const response = await axiosClient.get(`/group/user?cursor=${list.cursor}`)
            const {cursor,groups} = response.data
            setList({cursor,groups:[...list.groups,...groups]})
        } catch (error) {
            console.error(error);            
        }
    }
    useEffect(()=>{getUserGroups()},[])
    return <>
    <div className="d-flex flex-wrap">
        {list.groups && list.groups.map(group=>{
            return <div key={group.group.id} className="bg-gray-dark shadow rounded card m-2">
                <img src={`${process.env.REACT_APP_STATIC_PATH}${group.group.image}`} className="card-img-top" alt="group-image" />
                <div className="card-body">
                    <Link className="text-decoration-none" to={`/group/${group.group.id}`}><h5 className="card-title">{group.group.name}</h5></Link> 
                    <p className="card-text">{group.group.description}</p>
                    <p className="card-text"><small className="text-muted">Created At { group.group.createTime }</small></p>
                </div>
            </div>
        })}
    </div>
    </>
}

export default GroupsList