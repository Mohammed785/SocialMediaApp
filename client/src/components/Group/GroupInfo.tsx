import { useState,ChangeEvent, FormEvent } from "react";
import { IGroup } from "../../@types/group";
import axiosClient from "../../axiosClient";
import { useAuthContext } from "../../context/authContext"

interface IGroupInfoProps{
    group:IGroup
    setGroup:(group:IGroup)=>void
}

function GroupInfo({group,setGroup}:IGroupInfoProps){
    const [imagePreview, setImagePreview] = useState("")
    const {user} = useAuthContext()!
    const preview = (e: ChangeEvent<HTMLInputElement>) => {
        const images = e.target.files
        imagePreview && URL.revokeObjectURL(imagePreview)
        const img = images ? images.item(0) : ""
        const view = img ? URL.createObjectURL(img) : ""
        setImagePreview(view)
    }
    const handleSubmit = async(e:FormEvent)=>{
        e.preventDefault()
        try {
            const data = new FormData(e.currentTarget as HTMLFormElement)
            const { data: { group:newGroup } } = await axiosClient.patch(`/group/update/${group.id}`, data,{headers: {'Content-Type': "multipart/form-data" }})            
            setGroup(newGroup)
        } catch (error) {
            console.error(error);
        }
    }
    return <>
        {
            group.creatorId===user!.id && <>
                <form onSubmit={handleSubmit} method="POST" encType="multipart/form-data" className="col-lg-6 mt-4 rounded shadow">
                    <div className="bg-dark modal-content">
                        <div className="modal-header align-items-center">
                            <h5 className="text-muted text-center w-100 m-0" id="createModalLabel">
                                Update Group
                            </h5>
                        </div>
                        <div className="modal-body">
                            <div className="my-1 p-1">
                                <div className="d-flex flex-column">
                                    <div className="form-floating my-1">
                                        <input placeholder="Group name" defaultValue={group.name} name="name" id="name" className="form-control post-content border-0" />
                                        <label htmlFor="name">name</label>
                                    </div>
                                    <div className="form-floating my-1">
                                        <textarea cols={30} rows={5} defaultValue={group.description} placeholder="Group Description" name="description" id="description" className="form-control post-content border-0"></textarea>
                                        <label htmlFor="description">description</label>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <label className="form-label" htmlFor="private">Group Visibility: </label>
                                        <select style={{ width: "auto" }} defaultValue={group.private === true ? "true" : "false"} name="private" id="private" className="form-select border-0 mx-1 select" aria-label="Default select example">
                                            <option defaultChecked value="false">Public</option>
                                            <option value="true">Private</option>
                                        </select>
                                    </div>
                                    <label htmlFor="image mt-2">Group Image: </label>
                                    <input type="file" onChange={e => { preview(e) }} name="image" id="image" />
                                    <div className=" d-flex flex-wrap justify-content-between rounded p-1 mt-1">
                                        {imagePreview && <div className="preview">
                                            <img src={imagePreview} alt="group" className="preview-image" />
                                        </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="submit" className="btn btn-primary w-100">
                                Update
                            </button>
                        </div>
                    </div>
                </form>
            </>
        }
    </>
}
export default GroupInfo