
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axiosClient from "../axiosClient"
import Header from "../components/Profile/Header"
import { useAuthContext } from "../context/authContext"

function Profile(){
    let {id} = useParams()
    const [relations,setRelations] = useState<{relation:Record<string,any>[],request:Record<string,any>}>({relation:[],request:{}})
    const {user} = useAuthContext()!
    const navigate = useNavigate()
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
    },[])    
    return <>
    <Header id={parseInt(id!)} relations={relations}/>
    </>
}

export default Profile