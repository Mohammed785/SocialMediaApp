import { useState } from "react";
import { FaCommentAlt, FaEllipsisH } from "react-icons/fa";
import PostReactions from "./PostReactions"
import ReactToContent from "./ReactToContent";
import CommentList from "./CommentList";
import { useAuthContext } from "../../../context/authContext";
import {FaPencilAlt,FaTrash} from "react-icons/fa"
import axiosClient from "../../../axiosClient";
import PostUpdate from "./PostUpdate";
import PostModal from "./PostModal";

function Post({post,deletePost}:{post:Record<string,any>,deletePost:Function}) {
    const [postState,setPostState] = useState({...post})
    const {user} = useAuthContext()!
    const updateCommentCount = (count:number)=>setPostState({...postState,_count:{comments:postState._count.comments+count}})
    const setReactions = (reactions:[])=>{
        setPostState({...postState,reactions})
    }
    const updatePostImages = (images:Record<string,any>[])=>{
        setPostState({...postState,images})
    }
    const updateInfo = (info:Record<string,any>)=>{
        setPostState({...postState,...info})
    }
    const postDelete=async()=>{
        try {
            const response = await axiosClient.delete(`/post/delete/${post.id}`)
            deletePost(post.id)
        } catch (error) {
            console.error(error);
        }
    }
    return <>
        <div className="bg-white p-4 rounded shadow mt-3">
            <div className="d-flex justify-content-between">
                <div className="d-flex">
                    <img src="#" alt="avatar" className="rounded-circle me-2" style={{ width: "38px", height: "38px", objectFit: "cover" }} />
                    <div>
                        <p className="m-0 fw-bold">{post.author.firstName} {post.author.lastName}</p>
                        <span className="text-muted fs-7">{post.createTime}</span>
                    </div>
                </div>
                <div className="d-flex align-items-center">
                    <p className="text-muted me-2" style={{ margin: 0 }}>{postState.edited && "edited"}</p>                
                    <FaEllipsisH type="button" id={`post${post.id}Menu`} data-bs-toggle="dropdown" className="dropdown-toggle" aria-expanded="false"></FaEllipsisH>
                        <ul className="dropdown-menu border-0 shadow" aria-labelledby={`post${postState.id}Menu`} >
                            {
                                user!.id === postState.author.id && <>
                                <li className="d-flex align-items-center my-1 btn btn-success" data-bs-toggle="modal" data-bs-target={`#update${post.id}Modal`}>
                                    <FaPencilAlt className="me-1"></FaPencilAlt> Edit
                                </li>
                                    <li onClick={postDelete} className="d-flex align-items-center my-1 btn btn-danger">
                                        <FaTrash className="me-1"></FaTrash> Delete
                                    </li>
                                </>
                            }
                        </ul>

                </div>
            </div>
            <div className="mt-3">
                <div>
                    <p>
                        {postState.body}
                    </p>
                    <div className="post-images pointer" data-bs-toggle="modal" data-bs-target={`#post${post.id}modal`}>
                        {postState.images.length===1 && 
                            <img src={postState.images[0].image} className="img-fluid rounded"/>
                        }
                        {postState.images.length===2 &&
                            <div className="d-flex">{
                            postState.images.map((image:Record<string,any>)=>{
                                return <img key={image.id} src={image.image} style={{width:"50%",margin:"0 2px",height:"auto"}}/>
                            })
                        }
                        </div>
                        }
                        {postState.images.length>=3 &&
                            <div className="grid">
                            {
                                postState.images.map((image:Record<string,any>,idx:number)=>{
                                    if(idx<=2){
                                        return <div key={image.id} className={`card span-${idx === 0 ? 3 : 2}`} style={{ backgroundImage: `url(${image.image})` }}></div>

                                    }
                                })  
                            }
                            </div>
                        }
                    </div>
                </div>
                <div className="post__comment mt-3 position-relative">
                    <PostReactions {...{id:post.id,reactions:postState.reactions}}/>
                    <div className="accordion" id={`post${post.id}Accordion`}>
                        <div className="accordion-item border-0">
                            <h2 className="accordion-header" id="headingTwo">
                                <div className="accordion-button pointer d-flex justify-content-end collapsed" data-bs-toggle="collapse" data-bs-target={`#collapsePost${post.id}`} aria-expanded="false" aria-controls={`collapsePost${post.id}`}>
                                    <p className="m-0">{postState._count.comments} Comment{postState._count.comments>1&&"s"}</p>
                                </div>
                            </h2>
                            <hr />
                            <div className="d-flex justify-content-around">
                                <ReactToContent id={post.id} reactions={postState.reactions} setReactions={setReactions} type={"post"}/>
                                <div className="dropdown-item pointer rounded d-flex justify-content-center align-items-center pointer text-success p-1 collapsed" data-bs-toggle="collapse" data-bs-target={`#collapsePost${post.id}`} aria-expanded="false" aria-controls={`collapsePost${post.id}`}>
                                    <FaCommentAlt className=" me-3"></FaCommentAlt>
                                    <p className="m-0">Comment</p>
                                </div>
                            </div>                            
                            <CommentList {...{postId:post.id,updateCommentCount,commentable:postState.commentable}}/>
                        </div>
                    </div>
                </div>
            </div>
            <PostUpdate post={postState} updateInfo={updateInfo} postDelete={deletePost} update={updatePostImages}/>
            <PostModal {...{id:post.id,images:postState.images}}/>
        </div>
    </>
}

export default Post;