import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { FaEllipsisH, FaPencilAlt, FaTrash,FaThumbsDown,FaThumbsUp } from "react-icons/fa";
import { Link } from "react-router-dom";
import { IComment } from "../../../@types/post";
import axiosClient from "../../../axiosClient";
import { useAuthContext } from "../../../context/authContext";
import Reactions from "./Reactions";
import ReactToContent from "./ReactToContent";

interface ICommentProps{
    comment: IComment
    updateComment: (id:number,newComment:IComment)=>void
    deleteComment: (id:number)=>void
}

function Comment({comment,updateComment,deleteComment}:ICommentProps){
    const [reactionsState,setReactionsState] = useState(comment.reactions)
    const [editState,setEditState] = useState({edit:false,newVal:comment.body})
    const {user} = useAuthContext()!
    const editSubmit = async(e:FormEvent)=>{
        e.preventDefault()
        try {
            const response = await axiosClient.patch(`/comment/update/${comment.id}`,{body:editState.newVal})          
            setEditState({newVal:"",edit:false})
            updateComment(comment.id,response.data.comment)
            toast.success("Comment updated")
        } catch (error) {
            console.error(error);            
        }
    }
    const deleteComment_ = async(id:number)=>{
        try {
            await axiosClient.delete(`/comment/delete/${comment.id}`)
            deleteComment(id)
            toast.success("Comment deleted")
        } catch (error) {
            console.error(error);
        }
    }
    const setReactions = (reactions:[])=>{
        setReactionsState(reactions)
    }
    return <>    
        <div className="d-flex comment align-items-center my-1" id={`comment${comment.id}`}>
            <img src={`${process.env.REACT_APP_STATIC_PATH}${comment.author.profileImg}`} alt="avatar" className="rounded-circle me-2" style={{ width: "38px", height: "38px", objectFit: "cover" }} />
            <div className="p-2 rounded comment__input w-100">
                <div className="d-flex justify-content-between align-items-center">
                    <Link className="fw-bold m-0" style={{textDecoration:"none"}} to={`/profile/${comment.author.id}`}>{comment.author.firstName} {comment.author.lastName}</Link>
                    <div className="d-flex align-items-center">
                        <p className="text-white me-2" style={{margin:0}}>{comment.edited&&"edited"}</p>
                        <FaEllipsisH className="text-blue pointer" id={`comment${comment.id}CommentMenuButton`} data-bs-toggle="dropdown" aria-expanded="false"></FaEllipsisH>
                        <ul className="dropdown-menu border-0 shadow" aria-labelledby={`comment${comment.id}CommentMenuButton`} style={{ width: "auto" }}>
                        {
                            user!.id===comment.author.id &&<><li onClick={()=>setEditState({edit:true,newVal:comment.body})} className="d-flex align-items-center my-1 btn btn-success">
                                <FaPencilAlt className="me-1"></FaPencilAlt> Edit
                            </li>
                                <li onClick={() => deleteComment_(comment.id)} className="d-flex align-items-center my-1 btn btn-danger">
                                <FaTrash className="me-1"></FaTrash> Delete
                            </li>
                            </>
                        }
                        </ul>
                    </div>
                </div>
                {editState.edit?<form onSubmit={editSubmit} method="POST" className="d-flex">
                    <textarea value={editState.newVal} onChange={(e) => setEditState({...editState,newVal:e.target.value})} className="post-content form-control"></textarea>
                    <button type="submit" className="btn btn-info">Edit</button>
                </form>
                :<>
                    <p className="m-0 bg-gray rounded" style={{fontSize:"1.1rem"}}>{comment.body}</p>
                    <div className="d-flex justify-content-between"> 
                        <div className="me-2 d-flex pointer align-items-center" data-bs-toggle="modal" data-bs-target={`#comment${comment.id}reacts`}>
                            <FaThumbsUp className="text-primary"></FaThumbsUp>
                            <FaThumbsDown className="text-danger"></FaThumbsDown>
                            <p className="ms-1" style={{margin:0}}>{reactionsState.length}</p>
                        </div>
                        <div className="d-flex justify-content-end">
                                <ReactToContent {...{ id: comment.id, reactions: reactionsState,type:"comment",setReactions,authorId:comment.author.id}} />
                        </div>
                            <Reactions {...{ id: comment.id, reactions: reactionsState,type:"comment"}}/>
                    </div>
                </>
                }
            </div>
        </div>
    </>
}

export default Comment;