import { useEffect, useState } from "react"
import { IUser } from "../../@types/auth"
import { IChat } from "../../@types/chat"
import { useAuthContext } from "../../context/authContext"

interface Props{
    chat:IChat
    active:boolean
    setActiveId:(id:number)=>void
    setActiveChat:(chat:IChat)=>void
}

function Chat({ chat, active, setActiveId, setActiveChat }:Props) {
    const [friend,setFriend] = useState<IUser|null>(null)
    const {user} = useAuthContext()!
    useEffect(()=>{
        chat.user1Id!==user!.id?setFriend(chat.user1):setFriend(chat.user2)
    },[])
    const handleClick = ()=>{
        setActiveChat(chat)
        setActiveId(chat.id)
    }
    return <>
        <li className={`clearfix ${active && "active"}`} onClick={handleClick}>
            <img src={`${process.env.REACT_APP_STATIC_PATH}${friend?.profileImg}`} alt="avatar" />
            <div className="about">
                <div className="name">{friend?.firstName} {friend?.lastName}</div>
            </div>
        </li>
    </>
}

export default Chat