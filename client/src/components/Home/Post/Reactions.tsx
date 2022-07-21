import { RefObject, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";

function PostReactions({id,_count,reactions}:{id:number,_count:number,reactions:Record<string,any>[]}){
    const [reacts, setReacts] = useState({ reacts: reactions, filter: "all", _count: { like: 0, dislike: 0 } })
    const navigate = useNavigate()
    const likeFilterRef = useRef<HTMLDivElement>(null)
    const dislikeFilterRef = useRef<HTMLDivElement>(null)
    const handleReactFilter = (filter: string, ref?: RefObject<HTMLDivElement>) => {
        if (filter === "all") {
            setReacts({ ...reacts, filter: "all" })
            dislikeFilterRef.current?.classList.remove("selected-filter")
            likeFilterRef.current?.classList.remove("selected-filter")
        } else if (filter === reacts.filter) {
            setReacts({ ...reacts, filter: "all" })
            ref!.current?.classList.remove("selected-filter")
        } else {
            setReacts({ ...reacts, filter })
            ref!.current?.classList.add("selected-filter")
            ref!.current?.classList.contains("like")
                ? dislikeFilterRef.current?.classList.remove("selected-filter")
                : likeFilterRef.current?.classList.remove("selected-filter")
        }

    }
    const redirectToProfile=(id:number)=>{
        document.body.removeAttribute("style")
        document.querySelector(".modal-backdrop")?.remove(); 
        navigate(`/${id}/profile`)
    }
    useEffect(()=>{
        let likeCount = 0
        reactions.forEach(react => {
            if (react.reaction) likeCount += 1
        })
        setReacts(state=>({...state,_count:{like:likeCount,dislike:_count-likeCount}}))
    },[reacts.reacts])
    return <>
        <div className="d-flex pointer align-items-center top-0 start-0 position-absolute" style={{ height: "50px", zIndex: "5" }} data-bs-toggle="modal" data-bs-target={`#post${id}reacts`} >
            <div className="me-2">
                <FaThumbsUp className="text-primary"></FaThumbsUp>
                <FaThumbsDown className="text-danger"></FaThumbsDown>
            </div>
            <p className="m-0 text-muted fs-7">{_count}</p>
        </div>
        <div className="modal fade" id={`post${id}reacts`} aria-labelledby={`#post${id}reactsLabel`} tabIndex={-1} aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" >
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id={`post${id}reactsLabel`}>Post Reacts</h5>
                        <button className="btn-close" onClick={() => handleReactFilter("all")} type="button" data-bs-dismiss="modal" aria-label="close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="d-flex">
                            <div onClick={() => handleReactFilter("like", likeFilterRef)} ref={likeFilterRef} className="like me-3 pointer d-flex align-items-center">
                                <FaThumbsUp className="text-primary me-3"></FaThumbsUp>
                                <p style={{ margin: "0px" }}>{reacts._count.like}</p>
                            </div>
                            <div onClick={() => handleReactFilter("dislike", dislikeFilterRef)} ref={dislikeFilterRef} className="dislike ms-3 pointer d-flex align-items-center">
                                <FaThumbsDown className="text-danger me-3"></FaThumbsDown>
                                <p style={{ margin: "0px" }}>{reacts._count.dislike}</p>
                            </div>
                            <p className="text-muted m-auto">click on icon to filter reactions</p>
                        </div>
                        <hr style={{ margin: "5px" }} />
                        <ul className="list-group">
                            {reacts.reacts && reacts.reacts.map((react: Record<string, any>, i) => {
                                if (reacts.filter === "all" || react.reaction === (reacts.filter === "like") ? true : false) {
                                    return <li key={i} onClick={() => redirectToProfile(react.user.id)} className="list-item react-info my-2 d-flex align-items-center justify-content-between">
                                        <div className="d-flex align-items-center">
                                            <img src="#" className="rounded-circle" style={{ width: "40px", height: "40px", objectFit: "cover" }} alt="" />
                                            <p style={{ margin: "0px 5px", fontSize: "20px", fontWeight: "700" }}>{react.user.firstName} {react.user.lastName}</p>
                                        </div>
                                        {react.reaction ? <FaThumbsUp className="text-primary"></FaThumbsUp>
                                            : <FaThumbsDown className="text-danger"></FaThumbsDown>}
                                    </li>
                                }
                            })}
                            {!reacts.reacts.length && <p style={{ margin: "auto" }}>No reactions on this post</p>}

                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default PostReactions