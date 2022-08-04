import { useState } from "react"
import { IChat } from "../@types/chat"
import "../components/Chat/chat.css"
import ChatArea from "../components/Chat/ChatArea"
import ChatsList from "../components/Chat/ChatsList"

function Chat(){
    const [activeChat,setActiveChat] = useState<IChat|null>(null)
    const [activeId, setActiveId] = useState(0)
    return <>
        <div className="col-lg-12" style={{height:"100vh"}}>
            <div className="chat-card chat-app bg-dark" style={{top:"20%"}}>
                <div id="plist" className="people-list">
                    <h4 className="text-center">Chats List</h4>
                    <ChatsList {...{activeId,setActiveChat,setActiveId}}/>
                </div>
                {activeId ? <ChatArea {...{ activeId, chat: activeChat! }} /> : <div className="chat"><div className="chat-history scroll-chat"></div></div>}
            </div>
        </div>
    </>
}


export default Chat