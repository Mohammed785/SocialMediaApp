import { useEffect, useState } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { IUser } from "../@types/auth"
import { IFriendRequest, IRelation } from "../@types/relation"
import axiosClient from "../axiosClient"
import About from "../components/Profile/About"
import FriendsList from "../components/Profile/FriendsList"
import Header from "../components/Profile/Header"
import Timeline from "../components/Profile/Timeline"
import { useAuthContext } from "../context/authContext"
import { useSocketContext } from "../context/socketContext"
import useTitle from "../hooks/useTitle"

function Profile(){
    useTitle("Profiles")
    const {id} = useParams()    
    const [relations,setRelations] = useState<{relation:IRelation[],request:IFriendRequest|null}>({relation:[],request:null})
    const {user} = useAuthContext()!
    const [info, setInfo] = useState<IUser>(user!)
    const navigate = useNavigate()
    const [queryParams, setQueryParams] = useSearchParams()
    const page = queryParams.get("p")
    const {socket} = useSocketContext()
    
    useEffect(()=>{
        const getRelation = async()=>{
            try {                
                const {data:{relation,request}} = await axiosClient.get(`/relation/related/${id}`)
                if(relation[0] && relation[0].relatedId===user!.id && relation[0].friend===false){
                    return navigate("/",{replace:true})
                }
                setRelations({relation,request})
            } catch (error) {
                console.error(error);
            }
        }
        parseInt(id!)!==user!.id && getRelation()
    },[id])    

    useEffect(() => {
        const getInfo = async () => {
            try {
                const response = await axiosClient.get(`/user?id=${id}`)
                setInfo(response.data.user)
            } catch (error) {
                console.error(error);
            }
        }
        parseInt(id!)!==user?.id && getInfo() 
    }, [id])
    return <>
    <Header id={parseInt(id!)} info={info} relations={relations}/>
    {!page && <Timeline id={parseInt(id!)} />}
        {page === "about" && <About info={info} owner={parseInt(id!) === user!.id} />}
    {page==="friends" && <FriendsList id={id!} owner={parseInt(id!)===user!.id}/>}
    </>
}

export default Profile