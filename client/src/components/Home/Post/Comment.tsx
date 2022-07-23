import { FormEvent, useState } from "react";
import { FaEllipsisH, FaPencilAlt, FaTrash,FaThumbsDown,FaThumbsUp } from "react-icons/fa";
import axiosClient from "../../../axiosClient";
import { useAuthContext } from "../../../context/authContext";
import Reactions from "./Reactions";
import ReactToContent from "./ReactToContent";

function Comment({comment,updateComment,deleteComment}:{comment:Record<string,any>,updateComment:Function,deleteComment:Function}){
    const [reactionsState,setReactionsState] = useState(comment.reactions)
    const [editState,setEditState] = useState({edit:false,newVal:comment.body})
    const {user} = useAuthContext()!
    const editSubmit = async(e:FormEvent)=>{
        e.preventDefault()
        try {
            const response = await axiosClient.patch(`/comment/update/${comment.id}`,{body:editState.newVal})          
            setEditState({newVal:"",edit:false})
            updateComment(comment.id,response.data.comment)
        } catch (error) {
            console.error(error);            
        }
    }
    const deleteComment_ = async(id:number)=>{
        try {
            const response = await axiosClient.delete(`/comment/delete/${comment.id}`)
            deleteComment(id)
        } catch (error) {
            console.error(error);
        }
    }
    const setReactions = (reactions:[])=>{
        setReactionsState(reactions)
    }
    return <>    
        <div className="d-flex align-items-center my-1" id={`comment${comment.id}`}>
            <img src="#" alt="avatar" className="rounded-circle me-2" style={{ width: "38px", height: "38px", objectFit: "cover" }} />
            <div className="p-3 rounded comment__input w-100">
                <div className="d-flex justify-content-end align-items-center">
                    <p className="text-muted me-1" style={{margin:0}}>{comment.edited&&"edited"}</p>
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
                <p className="fw-bold m-0">{comment.author.firstName} {comment.author.lastName}</p>
                {editState.edit?<form onSubmit={editSubmit} method="POST" className="d-flex">
                    <textarea value={editState.newVal} onChange={(e) => setEditState({...editState,newVal:e.target.value})} className="form-control"></textarea>
                    <button type="submit" className="btn btn-info">Edit</button>
                </form>
                :<>
                    <p className="m-0 fs-7 bg-gray p-2 rounded">{comment.body}</p>
                    <div className="d-flex justify-content-between"> 
                        <div className="me-2 d-flex pointer align-items-center" data-bs-toggle="modal" data-bs-target={`#comment${comment.id}reacts`}>
                            <FaThumbsUp className="text-primary"></FaThumbsUp>
                            <FaThumbsDown className="text-danger"></FaThumbsDown>
                            <p className="ms-1" style={{margin:0}}>{reactionsState.length}</p>
                        </div>
                        <div className="d-flex justify-content-end">
                                <ReactToContent {...{ id: comment.id, reactions: reactionsState,type:"comment",setReactions}} />
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