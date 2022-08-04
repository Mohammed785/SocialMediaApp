import { useEffect, useRef, useState,UIEvent, Fragment } from "react"
import { IMessage } from "../../@types/chat"
import axiosClient from "../../axiosClient"
import { useAuthContext } from "../../context/authContext"
import { useSocketContext } from "../../context/socketContext"
import Message from "./Message"
import SendForm from "./SendForm"

function MessagesList({ activeId, friendId,active }: { activeId: number, friendId:number, active:boolean }) {
    const { user } = useAuthContext()!
    const [msgs, setMessages] = useState<IMessage[]>([])
    const lastEleRef = useRef<HTMLLIElement>(null)
    const { socket } = useSocketContext()
    const getMsgs = async () => {
        try {
            const { data } = await axiosClient.get(`/chat/${activeId}/messages`)
            setMessages([...data.msgs])
            lastEleRef.current!.scrollIntoView({ behavior: "smooth" })
        } catch (error) {
            console.error(error);
        }
    }
    const addMsg = (msg: IMessage) => {
        setMessages((prev) => {
            return [...prev, msg]
        })
        lastEleRef.current!.scrollIntoView({ behavior: "smooth" })
    }
    const dates = new Set()
    useEffect(() => {
        getMsgs();
        socket?.on("receiveMsg", addMsg)
        return () => { socket?.off("receiveMsg", addMsg) }
    }, [activeId])
    return <>
        <div className="chat-history scroll-chat">
            <ul className="m-b-0">
                {msgs.map(msg => {
                    const day = new Date(new Date(msg.createTime).toLocaleDateString()).getTime()
                    if (!dates.has(day)) {
                        dates.add(day)
                        return <Fragment key={msg.id}>
                            <div className="day text-center d-flex justify-content-center">
                                <p className="bg-gray-dark m-0 shadow">
                                    {new Date(msg.createTime).toLocaleDateString()}
                                </p>
                            </div>
                            <Message userId={user!.id} msg={msg} />
                        </Fragment>
                    }else{
                        return <Message key={msg.id} userId={user!.id} msg={msg} />
                    }
                })}
                <li style={{ opacity: "0" }} className="p-2" ref={lastEleRef}></li>
            </ul>
        </div>
        <SendForm chatId={activeId} friendId={friendId} active={active} addMsg={addMsg} />
    </>
}

export default MessagesList
 