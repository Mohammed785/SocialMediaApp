import { useState,useRef} from "react"
import toast from "react-hot-toast"
import { FaImage } from "react-icons/fa"
import { IPost, IPostImage } from "../../../@types/post"
import axiosClient from "../../../axiosClient"

interface IPostUpdateProps{
    post: IPost
    updateInfo: (o:{body:string,commentable:boolean,private:boolean})=>void;
    updateImages: (images:IPostImage[])=>void
    postDelete: (id:number)=>void
}

function PostUpdate({ post, updateImages, postDelete, updateInfo }:IPostUpdateProps){
    const [postInfo, setPostInfo] = useState<IPost>({...post})
    const [postImages, setPostImages] = useState<{ selected: FileList | any[], preview: any[] }>({ selected: [], preview: [] })
    const [captions, setCaptions] = useState<Record<string, any>>({})
    const imgInpRef = useRef<HTMLInputElement>(null)
    const addImages = async()=>{
        try {
            const newImages = []
            for (let i = 0; i < postImages.selected.length; i++) {
                const file = (postImages.selected as FileList).item(i)!
                const data = new FormData()
                data.append("image", file)
                data.append("description", captions[file.name])
                const response = await axiosClient.post(`/post/${post.id}/image/create`,data, { headers: { 'Content-Type': "multipart/form-data" } })    
                newImages.push(response.data.newImg)
            }
            setPostInfo({ ...postInfo, images: [...postInfo.images, ...newImages]})
            updateImages([...postInfo.images, ...newImages])
            setPostImages({selected:[],preview:[]})
            toast.success("Image added")
        } catch (error) {
            console.error(error);
        }
    }
    const deleteImage = async(id:number)=>{
        try {
            const response = await axiosClient.delete(`/post/image/delete/${id}`)
            const images = postInfo.images.filter((img:Record<string,any>) => {
                return img.id !== id
            })
            setPostInfo({...postInfo,images})
            if(!postInfo.body && !postInfo.images) postDelete(post.id)
            updateImages(images)
            toast.success("Image deleted")
        } catch (error) {
            console.error(error);            
        }
    }
    const previewImages=()=>{
        const images = imgInpRef.current?.files!
        for (const img of postImages.preview!) {
            URL.revokeObjectURL(img)
        }
        const newImgs = []
        const captions: Record<string, any> = {}
        for (let i = 0; i < images!.length; i++) {
            const img = images.item(i)!
            newImgs.push(URL.createObjectURL(img))
            captions[img.name] = ""
            
        }
        setPostImages({ selected: images, preview: newImgs })
        setCaptions(captions)
    }
    const updatePost= async()=>{
        try {
            const res = await axiosClient.patch(`/post/update/${post.id}`,{body:postInfo.body,commentable:postInfo.commentable,private:postInfo.private})
            updateInfo({ body: postInfo.body, commentable: postInfo.commentable, private: postInfo.private })
        } catch (error) {
            console.error(error);            
        }
    }
    return <>
        <div className="modal fade" id={`update${post.id}Modal`} tabIndex={-1} aria-labelledby={`update${post.id}ModalLabel`} aria-hidden="true" data-bs-backdrop="false">
            <form onSubmit={(e)=>{e.preventDefault()}} method="POST" encType="multipart/form-data" className="modal-dialog 1modal-dialog-centered">
                <div className="bg-dark modal-content">
                    <div className="modal-header align-items-center">
                        <h5 className="text-white text-center w-100 m-0" id={`update${post.id}ModalLabel`}>
                            Update Post
                        </h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="my-1 p-1">
                            <div className="d-flex flex-column">
                                <div className="d-flex align-items-center">
                                    <div className="p-2">
                                        <img src={`${process.env.REACT_APP_STATIC_PATH}${postInfo.author.profileImg}`} alt="avatar" className="rounded-circle" style={{ width: "38px", height: "38px", objectFit: "cover" }} />
                                    </div>
                                    <div style={{ display: "contents" }}>
                                        <select value={postInfo.private ? "true" : "false"} onChange={(e) => setPostInfo({ ...postInfo, private: (e.target.value === 'true') ? true : false })} className="form-select border-0 mx-1 select fs-7" aria-label="Default select example">
                                            <option value="false">Public</option>
                                            <option value="true">Private</option>
                                        </select>
                                        <select value={postInfo.commentable?"true":"false"} onChange={(e) => setPostInfo({ ...postInfo, commentable: (e.target.value==='true')?true:false })} className="form-select border-0 mx-1 select fs-7" aria-label="Default select example">
                                            <option value="true">Allow Comments</option>
                                            <option value="false">Block Comments</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-floating">
                                    <textarea cols={30} rows={5} value={postInfo.body} onChange={(e) => setPostInfo({ ...postInfo, body: e.target.value })} placeholder="Post Content" name="body"  className="form-control post-content border-0"></textarea>
                                    <label htmlFor="body">Post Content</label>
                                </div>
                                <button className="btn btn-success my-2" onClick={updatePost}>Update Info</button>
                                <p className="m-0 text-center">Post images</p>
                                <input onChange={previewImages} ref={imgInpRef} type="file" name="images" id="images" style={{ opacity: 0,height:0 }} multiple />
                                <div className=" d-flex flex-wrap justify-content-between rounded p-1 mt-1 mb-2">
                                    {postInfo.images && postInfo.images.map((img:Record<string,any>,i:number)=>{
                                        return <div className="preview" key={i+Date.now()}>
                                            <img src={process.env.REACT_APP_STATIC_PATH+img.image} alt="" className="preview-image" />
                                            <div className="form-floating">
                                                <textarea name="captions" disabled value={img.description} placeholder="Caption" className="form-control post-content caption"></textarea>
                                                <label>Caption</label>
                                            </div>
                                                <button className="btn btn-danger" onClick={()=>deleteImage(img.id)}>Delete</button>
                                        </div>
                                    })}
                                    <div className="mt-3 w-100">
                                        <hr />
                                        <p className="text-center mb-1">Images To Add</p>
                                        {postImages.preview && postImages.preview.map((preview, i) => {
                                            const name = postImages.selected[i].name
                                            return <div className="preview" key={i}>
                                                <img src={preview} alt="" className="preview-image" />
                                                <div className="form-floating">
                                                    <textarea name="captions" value={captions[name]} onChange={(e) => { setCaptions({ ...captions, [name]: e.target.value }) }} placeholder="Caption" className="form-control caption post-content"></textarea>
                                                    <label>Caption</label>
                                                </div>
                                            </div>
                                        })}
                                        <div className="d-grid gap-2 mt-2">
                                        <button className="btn btn-success ms-1" type="button" onClick={()=>addImages()}>Add All</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center">
                                    <FaImage type="button" style={{fontSize:"40px"}} onClick={() => imgInpRef.current?.click()} className="text-success pointer mx-1"></FaImage>
                                    <p className="m-0">add images</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </>
}

export default PostUpdate;