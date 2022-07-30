import axiosClient from "../../../axiosClient";
import { useAuthContext } from "../../../context/authContext";
import {FaEllipsisH,FaPencilAlt,FaTrash,FaSave, FaUnlink} from "react-icons/fa"

interface IPostOptionsProps{
    id: number
    saved: boolean
    authorId: number
    deletePost: (id: number) => void
    edited: boolean
}

function PostOptions({id,authorId,deletePost,saved,edited}:IPostOptionsProps){
    const {user} = useAuthContext()!
    const postDelete = async () => {
        try {
            const response = await axiosClient.delete(`/post/delete/${id}`)
            deletePost(id)
        } catch (error) {
            console.error(error);
        }
    }
    const PostSaver = async (type:string) => {
        try {
            if(type==='save'){
                await axiosClient.post(`post/${id}/save`)
            }else{
                await axiosClient.delete(`post/${id}/unsave`)
                deletePost(id)
            }
        } catch (error) {
            console.error(error);
        }
    }
    return <>
        <div className="d-flex align-items-center">
            <p className="text-muted me-2" style={{ margin: 0 }}>{edited && "edited"}</p>
            <FaEllipsisH type="button" id={`post${id}Menu`} data-bs-toggle="dropdown" className="dropdown-toggle" aria-expanded="false"></FaEllipsisH>
            <ul className="dropdown-menu border-0 shadow" aria-labelledby={`post${id}Menu`} >
                {
                    saved?<li className="d-flex align-items-center my-1 btn btn-warning" onClick={()=>PostSaver("unsave")}>
                        <FaUnlink className="me-1"></FaUnlink> UnSave
                    </li>
                        : <li className="d-flex align-items-center my-1 btn btn-warning" onClick={() => PostSaver("save")}>
                    <FaSave className="me-1"></FaSave> Save
                    </li>
                }
                {
                    user!.id === authorId && <>
                        <li className="d-flex align-items-center my-1 btn btn-success" data-bs-toggle="modal" data-bs-target={`#update${id}Modal`}>
                            <FaPencilAlt className="me-1"></FaPencilAlt> Edit
                        </li>
                        <li onClick={postDelete} className="d-flex align-items-center my-1 btn btn-danger">
                            <FaTrash className="me-1"></FaTrash> Delete
                        </li>
                    </>
                }
            </ul>
        </div>
    </>
}

export default PostOptions