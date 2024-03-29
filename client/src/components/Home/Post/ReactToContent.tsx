import { useState,useRef,useEffect } from "react"
import { useAuthContext } from "../../../context/authContext";
import axiosClient from "../../../axiosClient";
import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { IPostReaction } from "../../../@types/post";
import toast from "react-hot-toast";
import { useSocketContext } from "../../../context/socketContext";

interface Props{
    id: number
    type: string
    reactions: IPostReaction[]
    setReactions?: Function
    authorId?:number
}

function ReactToContent({ id, reactions,type,setReactions,authorId }: Props) {
    const [liked, setLiked] = useState<boolean|null>(null)
    const { user } = useAuthContext()!
    const { socket } = useSocketContext()
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
    const updateReactionsList = (reaction:IPostReaction, removed:boolean)=>{
        let newReactions;
        if(removed){
            newReactions = reactions.filter((react)=>{
                return react.user.id!==user!.id
            })
        }else{
            let found = false
            newReactions = reactions.map((react)=>{
                if (react.user.id === user!.id){
                    found = true
                    react.reaction = reaction.reaction
                }
                return react
            })
            if(!found){
                reaction.user = user!
                newReactions.unshift(reaction)
            }
        }
        !removed && toast.success(`${type} ${reaction.reaction?"liked":"disliked"}`)
        if(setReactions)setReactions(newReactions)
    }
    const react = async (react="like") => {        
        try {
            const response = await axiosClient.post(`/${type}/${id}/react?react=${react}`)
            const { reaction, removed, msg } = response.data 
            if(removed){
                updateReactionsList(reaction, true)
                setLiked(null)
                toast.success(`${type} react removed`)
            }else{
                updateReactionsList(reaction, false)
                setLiked(reaction.reaction)
                socket?.emit("reactOn",authorId,type,`${user?.firstName} ${user?.lastName}`,react)
            }
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
        <div onClick={async() => {await react("like")}} ref={likeRef} className={`${type==="post"&&"dropdown-item"} action rounded d-flex justify-content-center align-items-center pointer text-muted p-1`}>
            <FaThumbsUp className="me-3 action"></FaThumbsUp>
            <p className="m-0">Like</p>
        </div>
        <div onClick={async () => { await react("dislike") }} ref={dislikeRef} className={`${type==="post"&&"dropdown-item"} action rounded d-flex justify-content-center align-items-center pointer text-muted p-1`}>
            <FaThumbsDown className=" me-3 action"></FaThumbsDown>
            <p className="m-0">Dislike</p>
        </div>
    </>
}

export default ReactToContent