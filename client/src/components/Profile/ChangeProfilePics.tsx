import { ChangeEvent, FormEvent, useState } from "react"
import toast from "react-hot-toast"
import axiosClient from "../../axiosClient"
import { useAuthContext } from "../../context/authContext"

function ChangeProfilePics({type}:{type:"profile"|"cover"}){
    const [image,setImage] = useState("")
    const {user,setCurrentUser} = useAuthContext()!
    const preview = (e:ChangeEvent<HTMLInputElement>)=>{
        const img = e.currentTarget.files?.item(0)
        URL.revokeObjectURL(image)
        img && setImage(URL.createObjectURL(img))
    }
    const handleSubmit = async(e:FormEvent)=>{
        e.preventDefault()
        try {
            const {data} = await axiosClient.patch(`/user/img?type=${type}`,new FormData(e.currentTarget as HTMLFormElement))
            type === 'profile' ? setCurrentUser({ ...user!, profileImg: data.image }) : setCurrentUser({ ...user!, coverImg: data.image })
            toast.success("image updated")
        } catch (error) {
            console.error(error);            
        }
    }
    return <>
        <button className="btn btn-primary ms-2" data-bs-toggle="modal" data-bs-target={`#change${type}ImgModal`}>Change {type} img</button>
        <div className="modal fade" id={`change${type}ImgModal`} tabIndex={-1} aria-labelledby={`change${type}ImgLabel`} aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content bg-dark">
                    <div className="modal-header text-muted">
                        <h5 className="modal-title" id={`change${type}ImgLabel`}>Change {type} img</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <input type="file" onChange={preview} className="form-control" name="image" id="image" required/>
                            <img src={image} alt="" className="my-1" style={{width:"100px"}}/>
                            <button type="submit" className="btn w-100 btn-success mt-1">Upload</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default ChangeProfilePics