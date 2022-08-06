import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { IComment } from "../../../@types/post";
import axiosClient from "../../../axiosClient";
import { useAuthContext } from "../../../context/authContext";
import { useSocketContext } from "../../../context/socketContext";

function CommentForm({ id, addComment, authorId }: { id: number, authorId?:number, addComment:(comment:IComment)=>void}){
    const [comment,setComment] = useState("")
    const {user} = useAuthContext()!
    const {socket} = useSocketContext()
    const handleSubmit = async(e:FormEvent)=>{
        e.preventDefault()
        try {
            const response = await axiosClient.post(`/comment/create/${id}`,{body:comment})
            const { comment: newComment }: { comment: IComment } = response.data
            newComment.reactions = []
            newComment.author = user!
            newComment._count={comments:0}
            setComment("")            
            addComment(newComment)
            toast.success("Comment created")
            socket?.emit("commentOnPost",authorId,`${user?.firstName} ${user?.lastName}`)
        } catch (error) {
            console.error(error);            
        }
    }
    return <>
        <form method="POST" onSubmit={handleSubmit} className="d-flex my-1">
            <div>
                <img src={`${process.env.REACT_APP_STATIC_PATH}${user!.profileImg}`} alt="avatar" className="rounded-circle me-2" style={{ width: "38px", height: "38px", objectFit: "cover" }} />
            </div>
            <input type="text" required value={comment} onChange={(e)=>setComment(e.target.value)} className="post-content form-control border-0 rounded-pill bg-gray" placeholder="Write a comment" />
        </form>
    </>
}

export default CommentForm