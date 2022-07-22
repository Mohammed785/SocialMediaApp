import { FormEvent, useState } from "react";
import axiosClient from "../../../axiosClient";
import image from "../../img.jpg";

function CommentForm({id}:{id:number}){
    const [comment,setComment] = useState("")
    const handleSubmit = async(e:FormEvent)=>{
        e.preventDefault()
        try {
            const response = await axiosClient.post(`/comment/create/${id}`,{body:comment})
            setComment("")
        } catch (error) {
            console.error(error);            
        }
    }
    return <>
        <form method="POST" onSubmit={handleSubmit} className="d-flex my-1">
            <div>
                <img src={image} alt="avatar" className="rounded-circle me-2" style={{ width: "38px", height: "38px", objectFit: "cover" }} />
            </div>
            <input type="text" required value={comment} onChange={(e)=>setComment(e.target.value)} className="form-control border-0 rounded-pill bg-gray" placeholder="Write a comment" />
        </form>
    </>
}

export default CommentForm