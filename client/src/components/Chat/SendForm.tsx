import { FormEvent, useEffect, useRef, useState } from "react"
import { FaPaperPlane } from "react-icons/fa"
import { IMessage } from "../../@types/chat"
import axiosClient from "../../axiosClient"
import { useSocketContext } from "../../context/socketContext"

function SendForm({ chatId, friendId,addMsg, active }:{chatId:number,friendId:number,active:boolean,addMsg:(msg:IMessage)=>void}) {
    const inpRef = useRef<HTMLInputElement>(null)
    const [msg,setMsg] = useState("")
    const {socket} = useSocketContext()
    const handleSubmit = async(e:FormEvent)=>{
        e.preventDefault()
        try {
            const {data} = await axiosClient.post(`/chat/${chatId}/message/create`,{content:msg})
            setMsg("")
            socket?.emit("sendMsg",friendId,data.msg)
            addMsg(data.msg)
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(()=>inpRef.current?.focus(),[])
    return <>
        <div className="chat-message clearfix">
            <form onSubmit={handleSubmit}>
                <div className="input-group mb-0">
                    <input ref={inpRef} value={msg} onChange={(e)=>{setMsg(e.target.value)}}  type="text" className="form-control me-3 input" required name="content" id="content" placeholder="Enter text here..." />
                    <button type="submit" disabled={!active} className="input-group-prepend border-0" style={{backgroundColor:"transparent"}}>
                        <span  className="input-group-text icon"><FaPaperPlane/></span>
                    </button >
                </div>
            </form>
        </div>
    </>
}

export default SendForm