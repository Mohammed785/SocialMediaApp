import { useEffect, useState } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import axiosClient from "../axiosClient"
import About from "../components/Profile/About"
import Header from "../components/Profile/Header"
import Timeline from "../components/Profile/Timeline"
import { useAuthContext } from "../context/authContext"

function Profile(){
    const {id} = useParams()    
    const [relations,setRelations] = useState<{relation:Record<string,any>[],request:Record<string,any>}>({relation:[],request:{}})
    const [info, setInfo] = useState<Record<string, any>>({})
    const {user} = useAuthContext()!
    const navigate = useNavigate()
    const [queryParams, setQueryParams] = useSearchParams()
    const page = queryParams.get("p")
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
        getInfo() 
    }, [id])
    return <>
    <Header id={parseInt(id!)} info={info} relations={relations}/>
    {!page && <Timeline id={parseInt(id!)} />}
    {page==="about" && <About info={info}/>}
    </>
}

export default Profile