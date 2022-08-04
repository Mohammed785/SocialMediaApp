import { useAuthContext } from "../../context/authContext"
import { useEffect, useState } from "react"
import { IUser } from "../../@types/auth"
import { IChat } from "../../@types/chat"
import MessagesList from "./MessagesList"

function ChatArea({ activeId, chat }: { activeId: number, chat: IChat }){
    const { user } = useAuthContext()!
    const [friend, setFriend] = useState<IUser>({} as IUser)
    const getFriend = () => {
        return chat.user1Id !== user!.id ? setFriend(chat.user1) : setFriend(chat.user2)
    }
    useEffect(()=>{
        getFriend()
    },[activeId])
    return <>
    <div className="chat">
            <div className="chat-header clearfix">
                <div className="row">
                    <div className="col-lg-6">
                        <a data-target="#view_info">
                            <img src={process.env.REACT_APP_STATIC_PATH + friend.profileImg} alt="avatar" />
                        </a>
                        <div className="chat-about">
                            <h6 className="m-b-0">{friend.firstName} {friend.lastName}</h6>
                        </div>
                    </div>
                </div>
            </div>
        <MessagesList {...{activeId,friendId:friend.id,active:chat.active}}/>
    </div>
    </>
}

export default ChatArea