import { useEffect } from "react"
import PostList from "../Home/Post/PostList"

function Timeline({id}:{id:number}){
    useEffect(()=>{
        document.body.classList.add("bg-dark")
        return () => document.body.classList.remove("bg-dark")
    },[])
    return <>
        <div className="col-12 col-lg-6 pb-5">
            <div className="d-flex flex-column justify-content-center mx-auto" style={{position: "absolute",top: "80%",  maxWidth: "680px" }}>
                <PostList {...{postsType:"all",userId:id}}/>
            </div>
        </div>
    </>
}


export default Timeline