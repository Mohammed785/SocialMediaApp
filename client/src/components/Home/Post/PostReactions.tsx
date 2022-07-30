import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { IPostReaction } from "../../../@types/post";
import Reactions from "./Reactions";

function PostReactions({id,reactions}:{id:number,reactions:IPostReaction[]}){
    return <>
        <div className="d-flex pointer align-items-center top-0 start-0 position-absolute" style={{ height: "50px", zIndex: "5" }} data-bs-toggle="modal" data-bs-target={`#post${id}reacts`} >
            <div className="me-2">
                <FaThumbsUp className="text-primary"></FaThumbsUp>
                <FaThumbsDown className="text-danger"></FaThumbsDown>
            </div>
            <p className="m-0 text-muted fs-7">{reactions.length}</p>
        </div>
        <Reactions {...{id,reactions,type:"post"}}/>
    </>
}

export default PostReactions