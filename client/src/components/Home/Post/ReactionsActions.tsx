import { useState,useRef,useEffect } from "react"
import { useAuthContext } from "../../../context/authContext";
import axiosClient from "../../../axiosClient";
import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";


function ReactToPost({ id, reactions }: { id: number, reactions: Record<string, any>[] }) {
    const [liked, setLiked] = useState(null)
    const { user } = useAuthContext()!
    const likeRef = useRef<HTMLDivElement>(null)
    const dislikeRef = useRef<HTMLDivElement>(null)
    const updateBtns = () => {
        likeRef.current?.classList.remove("text-primary","text-muted")
        dislikeRef.current?.classList.remove("text-danger","text-muted")
        if (liked !== null) {
            if(liked){
                likeRef.current?.classList.add("text-primary")
                dislikeRef.current?.classList.add("text-muted")
            }else{
                dislikeRef.current?.classList.add("text-danger")
                likeRef.current?.classList.add("text-muted")
            }
        }else{
            dislikeRef.current?.classList.add("text-muted")
            likeRef.current?.classList.add("text-muted")
        }
    }
    const react = async (react="like") => {        
        try {
            const response = await axiosClient.post(`/post/${id}/react?react=${react}`)
            const { reaction, removed, msg } = response.data            
            setLiked(removed ? null : reaction.reaction)
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
        const found = reactions.find((reaction: Record<string, any>) => reaction.user.id === user!.id)
        if (found) {
            setLiked(found.reaction)
        }
    }, [])
    useEffect(() => {
        updateBtns()
    }, [liked])
    return <>
        <div onClick={async() => {await react("like")}} ref={likeRef} className="dropdown-item pointer rounded d-flex justify-content-center align-items-center pointer text-muted p-1">
            <FaThumbsUp className="me-3"></FaThumbsUp>
            <p className="m-0">Like</p>
        </div>
        <div onClick={async() => {await react("dislike")}} ref={dislikeRef} className="dropdown-item pointer rounded d-flex justify-content-center align-items-center pointer text-muted p-1">
            <FaThumbsDown className=" me-3"></FaThumbsDown>
            <p className="m-0">Dislike</p>
        </div>
    </>
}

export default ReactToPost