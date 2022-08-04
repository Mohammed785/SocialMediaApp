import { ChangeEvent, FormEvent, useState } from "react"
import toast from "react-hot-toast"
import axiosClient from "../../axiosClient"
import useFormFields from "../../hooks/useFormChange"

function CreateForm(){
    const [groupInfo, setGroupInfo] = useFormFields({ name: "", description: "", private :"false"})
    const [imagePreview,setImagePreview] = useState("")
    const preview = (e:ChangeEvent<HTMLInputElement>)=>{
        const images = e.target.files
        imagePreview &&URL.revokeObjectURL(imagePreview)
        const img = images ? images.item(0) :""
        const view = img ? URL.createObjectURL(img) :""
        setImagePreview(view)
    }
    const handleSubmit = async(e:FormEvent)=>{
        e.preventDefault()
        const data = new FormData((e.currentTarget as HTMLFormElement))
        try {
            await axiosClient.post(`/group/create`, data, {headers: { 'Content-Type': "multipart/form-data" }})
            toast.success("group created")
        } catch (error) {
            console.error(error);            
        }
    }
    return <>
        <form onSubmit={handleSubmit} method="POST" encType="multipart/form-data" className="mt-4 rounded shadow">
            <div className="bg-dark modal-content">
                <div className="modal-header align-items-center">
                    <h5 className="text-white text-center w-100 m-0" id="createModalLabel">
                        Create Group
                    </h5>
                </div>
                <div className="modal-body">
                    <div className="my-1 p-1">
                        <div className="d-flex flex-column">
                            <div className="form-floating my-1">
                                <input required value={groupInfo.name} onChange={setGroupInfo} placeholder="Group name" name="name" id="name" className="post-content form-control bg-gray border-0" />
                                <label htmlFor="name">name</label>
                            </div>
                            <div className="form-floating my-1">
                                <textarea required cols={30} rows={5} value={groupInfo.description} onChange={setGroupInfo} placeholder="Group Description" name="description" id="description" className="post-content form-control bg-gray border-0"></textarea>
                                <label htmlFor="description">description</label>
                            </div>
                            <div className="d-flex align-items-center">
                                <label className="form-label" htmlFor="private">Group Visibility: </label>
                                <select required value={groupInfo.private} onChange={setGroupInfo} style={{ width: "auto" }} name="private" id="private" className="select form-select border-0 mx-1 bg-gray " aria-label="Default select example">
                                    <option defaultChecked value="false">Public</option>
                                    <option value="true">Private</option>
                                </select>
                            </div>
                            <label htmlFor="image mt-2">Group Image: </label>
                            <input required type="file" onChange={e => { preview(e) }} name="image" id="image" />
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
                        Create
                    </button>
                </div>
            </div>
        </form>
    </>
}


export default CreateForm