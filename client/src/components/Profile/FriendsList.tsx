import { useEffect, useState } from "react"
import axiosClient from "../../axiosClient";
import { Link } from "react-router-dom";
import { IRelation } from "../../@types/relation";
import toast from "react-hot-toast";

function FriendsList({id,owner}:{id:string,owner:boolean}){
    const [friends,setFriends] = useState<IRelation[]>([])
    const getFriends = async()=>{
        try {
            const {data:{list}} = await axiosClient.get(`/relation/friend/list/${id}`)
            setFriends(list)
        } catch (error) {
            console.error(error);            
        }
    }
    const unfriend = async(id:number)=>{
        try {
            await axiosClient.post(`/relation/unfriend/${id}`)
            setFriends(friends.filter(friend=>friend.related.id!==id))
            toast.success("friend removed")
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(()=>{
        getFriends()
    },[id])
    return <>
    <div className="col-lg-8 d-flex flex-column align-items-center justify-content-center w-100 bg-dark shadow p-2" style={{position:"absolute",top:"78%"}}>
            <ul className="list-group my-2" style={{width:"55%"}}>
                <h3 className="text-center text-white">{friends.length} Friends</h3>
                {
                    friends.map((friend) => {
                        return <li key={friend.related.id} className="list-group-item d-flex align-items-center justify-content-between my-1 shadow member-rounded p-2 bg-gray-dark">
                            <div className="member-info">
                                <img className="rounded-circle" src={`${process.env.REACT_APP_STATIC_PATH}${friend.related.profileImg}`} alt="" />
                                <Link to={`/profile/${friend.related.id}`}>
                                    <p>{friend.related.firstName} {friend.related.lastName}</p>
                                </Link>
                            </div>
                            {owner &&<button className="btn btn-danger ms-2" onClick={async () => { await unfriend(friend.related.id) }}>Unfriend</button>}
                        </li>
                    })
                }
            </ul>
        </div>
    </>
}

export default FriendsList