import { FormEvent, useRef, useState } from "react"
import { FaImage } from "react-icons/fa"
import axiosClient from "../../../axiosClient"
import { useAuthContext } from "../../../context/authContext"


function PostForm({groupId}:{groupId?:number}) {
    const [postImages, setPostImages] = useState<{selected:FileList|any[],preview:any[]}>({selected:[],preview:[]})
    const [captions, setCaptions] = useState<Record<string, any>>({})
    const [postInfo, setPostInfo] = useState({ content: "", private: "false", commentable:"true" })
    const imgInpRef = useRef<HTMLInputElement>(null)
    const {user} = useAuthContext()!
    function previewImages(){
        const images = imgInpRef.current?.files!
        for (const img of postImages.preview!) {
            URL.revokeObjectURL(img)
        }        
        const newImgs = []
        const captions:Record<string,any> = {}
        for (let i = 0; i < images!.length; i++) {
            const img = images.item(i)!
            newImgs.push(URL.createObjectURL(img))
            captions[img.name]=""
        }
        setPostImages({selected:images,preview:newImgs})
        setCaptions(captions)
    }
    function getFormData(){
        const data = new FormData()
        for (let i = 0; i < postImages.selected.length; i++) {
            const file = (postImages.selected as FileList).item(i)!
            data.append("images",file)
            data.append("captions", captions[file.name])
        }
        data.append("body",postInfo.content)
        data.append("isPrivate",postInfo.private)
        data.append("commentable",postInfo.commentable)
        return data
    }
    async function handleSubmit(e:FormEvent){
        e.preventDefault()
        const data = getFormData()
        try {
            const response = await axiosClient.post(`/post/create?group=${groupId}`,data,{headers:{'Content-Type':"multipart/form-data"}})
            console.log(response);
        } catch (error) {
            console.error(error);            
        }
    }
    return <>
        <div className="bg-white p-3 mt-3 rounded border shadow">
            <div className="d-flex" typeof="button" data-bs-toggle="modal" data-bs-target="#createModal">
                <div className="p-1">
                    <img src={`${process.env.REACT_APP_STATIC_PATH}${user!.profileImg}`} alt="avatar" className="rounded-circle me-2" style={{ width: "38px", height: "38px", objectFit: "cover" }} />
                </div>
                <input type="text" className="form-control rounded-pill border-0 bg-gray pointer" style={{ cursor: "pointer" }}  placeholder="What's on your mind?" />
            </div>
            <div className="modal fade" id="createModal" tabIndex={-1} aria-labelledby="createModalLabel" aria-hidden="true" data-bs-backdrop="false">
                <form onSubmit={handleSubmit} method="POST" encType="multipart/form-data" className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header align-items-center">
                            <h5 className="text-dark text-center w-100 m-0" id="createModalLabel">
                                Create Post
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"
                                aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="my-1 p-1">
                                <div className="d-flex flex-column">
                                    <div className="d-flex align-items-center">
                                        <div className="p-2">
                                            <img src={`${process.env.REACT_APP_STATIC_PATH}${user!.profileImg}`} alt="avatar" className="rounded-circle" style={{ width: "38px", height: "38px", objectFit: "cover" }} />
                                        </div>
                                        <div style={{display:"contents"}}>
                                            <select value={postInfo.private} onChange={(e)=>setPostInfo({...postInfo,private:e.target.value})} className="form-select border-0 mx-1 bg-gray fs-7" aria-label="Default select example">
                                                <option value="false">Public</option>
                                                <option value="true">Private</option>
                                            </select>
                                            <select value={postInfo.commentable} onChange={(e) => setPostInfo({ ...postInfo, commentable: e.target.value })} className="form-select border-0 mx-1 bg-gray fs-7" aria-label="Default select example">
                                                <option value="true">Allow Comments</option>
                                                <option value="false">Block Comments</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-floating">
                                        <textarea cols={30} rows={5} value={postInfo.content} onChange={(e)=>setPostInfo({...postInfo,content:e.target.value})} placeholder="Post Content" name="body" id="body" className="form-control bg-gray border-0"></textarea>
                                        <label htmlFor="body">Post Content</label>
                                    </div>
                                    <input onChange={previewImages} ref={imgInpRef} type="file" name="images" id="images" style={{ opacity: 0 }} multiple />
                                    <div className=" d-flex flex-wrap justify-content-between border border-1 border-light rounded p-1 mt-1">
                                        {postImages.preview && postImages.preview.map((preview,i)=>{
                                            const name = postImages.selected[i].name
                                            return <div className="preview" key={i}>
                                                <img src={preview} alt="" className="preview-image" />
                                                <div className="form-floating">
                                                    <textarea name="captions" value={captions[name]} onChange={(e)=>{setCaptions({...captions,[name]:e.target.value})}} placeholder="Caption" className="form-control caption"></textarea>
                                                    <label>Caption</label>
                                                </div>
                                            </div>
                                        })}
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <FaImage type="button" style={{ fontSize: "40px" }} onClick={() => imgInpRef.current?.click()} className="text-success pointer mx-1"></FaImage>
                                        <p className="m-0">add images</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="submit" className="btn btn-primary w-100">
                                Post
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <hr />
            <div className="d-flex flex-column flex-lg-row mt-3">
                <div className=" dropdown-item rounded d-flex align-items-center justify-content-center" typeof="button" data-bs-toggle="modal" data-bs-target="#createModal">
                    <FaImage className="me-2 text-success"></FaImage>
                    <p className="m-0 text-muted">Photo</p>
                </div>
            </div>
        </div>
    </>
}

export default PostForm