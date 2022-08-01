import { useState } from "react";
import { FaCommentAlt } from "react-icons/fa";
import PostReactions from "./PostReactions"
import ReactToContent from "./ReactToContent";
import CommentList from "./CommentList";
import PostUpdate from "./PostUpdate";
import PostContent from "./PostContent";
import PostOptions from "./PostOptions";
import { IPost, IPostImage, IPostReaction } from "../../../@types/post";
import toast from "react-hot-toast";

function Post({post,deletePost}:{post:IPost,deletePost:(id:number)=>void}) {
    const [postState,setPostState] = useState({...post})
    const updateCommentCount = (count:number)=>setPostState({...postState,_count:{comments:postState._count.comments+count}})
    const setReactions = (reactions:IPostReaction[])=>{
        setPostState({...postState,reactions})
    }
    const updatePostImages = (images:IPostImage[])=>{
        toast.success("Post images updated")
        setPostState({...postState,images})
    }
    const updateInfo = (info:{body:string,commentable:boolean,private:boolean})=>{
        toast.success("Post updated")
        setPostState({...postState,...info})
    }
    return <>
        <div className="bg-dark post p-4 rounded shadow mt-3">
            <div className="d-flex justify-content-between">
                <div className="d-flex">
                    <img src={`${process.env.REACT_APP_STATIC_PATH}${post.author.profileImg}`} alt="avatar" className="rounded-circle me-2" style={{ width: "38px", height: "38px", objectFit: "cover" }} />
                    <div>
                        <p className="m-0 fw-bold">{post.author.firstName} {post.author.lastName}</p>
                        <span className="text-muted fs-7">{post.createTime}</span>
                    </div>
                </div>
                <PostOptions {...{id:post.id,authorId:post.author.id,edited:postState.edited,deletePost,saved:false}}/>
            </div>
            <div className="mt-3">
                <PostContent {...{id:post.id,images:postState.images,body:postState.body}}/>
                <div className="post__comment mt-3 position-relative">
                    <PostReactions {...{id:post.id,reactions:postState.reactions}}/>
                    <div className="bg-dark accordion" id={`post${post.id}Accordion`}>
                        <div className="bg-dark accordion-item border-0">
                            <h2 className="bg-dark accordion-header" id="headingTwo">
                                <div className="bg-dark accordion-button pointer d-flex justify-content-end collapsed" data-bs-toggle="collapse" data-bs-target={`#collapsePost${post.id}`} aria-expanded="false" aria-controls={`collapsePost${post.id}`}>
                                    <p className="m-0 text-muted">{postState._count.comments} Comment{postState._count.comments>1&&"s"}</p>
                                </div>
                            </h2>
                            <hr />
                            <div className="d-flex justify-content-around">
                                <ReactToContent id={post.id} reactions={postState.reactions} setReactions={setReactions} type={"post"}/>
                                <div className="dropdown-item action pointer rounded d-flex justify-content-center align-items-center pointer text-success p-1 collapsed" data-bs-toggle="collapse" data-bs-target={`#collapsePost${post.id}`} aria-expanded="false" aria-controls={`collapsePost${post.id}`}>
                                    <FaCommentAlt className="me-3"></FaCommentAlt>
                                    <p className="m-0">Comment</p>
                                </div>
                            </div>                            
                            <CommentList {...{postId:post.id,updateCommentCount,commentable:postState.commentable}}/>
                        </div>
                    </div>
                </div>
            </div>
            <PostUpdate post={postState} updateInfo={updateInfo} postDelete={deletePost} updateImages={updatePostImages}/>
        </div>
    </>
}

export default Post;