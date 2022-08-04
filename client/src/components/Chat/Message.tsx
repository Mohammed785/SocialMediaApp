import { IMessage } from "../../@types/chat"

function Message({msg,userId}:{msg:IMessage,userId:number}){
    return <>
        <li className="clearfix msg">
            <div className={msg.senderId!==userId?`other-msg`:"my-msg"}>
                <span className="message-data-time me-2">{new Date(msg.createTime).toLocaleTimeString()}</span>
                <div className={`message float-right ${msg.senderId !== userId ? `other-message` : "my-message"}`}>
                    {msg.content}
                </div>
            </div>
        </li>
    </>
}

export default Message