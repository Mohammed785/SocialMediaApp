import { ChangeEvent, FormEvent, useState } from "react";
import axiosClient from "../../../axiosClient";

function StoryCreateForm(){
    const [story, setStory] = useState<{ caption: string|null, image: File | null, preview: string }>({ caption: "", image: null, preview: "" })
    function handleImage(e: ChangeEvent<HTMLInputElement>) {
        if (e.currentTarget.files) {
            const image = e.currentTarget.files[0]
            story.preview && URL.revokeObjectURL(story.preview)
            setStory({ ...story, image, preview: URL.createObjectURL(image) })
        }

    }
    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        try {
            const data = new FormData()
            story.image && data.append("image", story.image)
            story.caption && data.append("caption", story.caption)
            if(!story.image && !story.caption){
                // TODO:ERROR
            }else{
                const response = await axiosClient.post("/status/create", data)
                setStory({caption:"",image:null,preview:""})
            }
        } catch (error) {
            console.error(error);

        }
    }
    return <>
        <div className="modal fade" id="createStoryForm" tabIndex={-1} data-bs-keyboard="false" data-bs-backdrop="static" aria-labelledby="Story Form" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <form onSubmit={handleSubmit} method="POST" className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Story Form</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="my-1 p-1">
                            <div className="d-flex flex-column">
                                <div className="form-floating">
                                    <textarea cols={30} rows={5} value={story.caption||""} onChange={(e) => setStory({ ...story, caption: e.target.value })} placeholder="Story Caption" name="caption" id="caption" className="form-control bg-gray border-0"></textarea>
                                    <label htmlFor="caption">Story Caption</label>
                                </div>
                                <div className=" d-flex flex-wrap justify-content-between border border-1 border-light rounded p-1 mt-1">
                                    <input onChange={handleImage} type="file" name="image" id="image" className="form-control" />
                                    {story.image &&
                                        <div className="preview">
                                            <img src={story.preview} alt="" className="preview-image" />
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
                        <button className="btn btn-danger" data-bs-target="#updateStoryForm" data-bs-toggle="modal">
                            Delete Story
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </>
}

export default StoryCreateForm;