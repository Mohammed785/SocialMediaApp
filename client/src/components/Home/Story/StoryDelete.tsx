import { useEffect, useState } from "react";
import axiosClient from "../../../axiosClient";

function StoryDeleteForm(){
    const [myStories,setMyStories] = useState([])
    useEffect(()=>{
        async function getMyStatus(){
           try {
            const response = await axiosClient.get(`/status/author`)
            setMyStories(response.data.status)
           } catch (error) {
            console.error(error)
           } 
        }
        getMyStatus()
    },[])
    async function deleteStory(id:number){
        try {
            await axiosClient.delete(`/status/${id}/delete`)
            setMyStories(myStories.filter((story:{id:number})=>{
                return story.id!==id
            }))
        } catch (error) {
            console.error(error);            
        }
    }
    return <>
        <div className="modal fade" id="updateStoryForm" aria-hidden="true" aria-labelledby="updateStoryForm" tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="updateStoryForm">My Stories</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {myStories && myStories.map((story:Record<string,any>)=>{
                            return<>
                            <div className="preview my-2" key={story.id}>
                                {story.image && <img src={story.image} crossOrigin='anonymous' className="preview-image" alt="story image" />}
                                <div className="d-flex w-100 justify-content-between">
                                    <p style={{fontSize:"1.5em"}}>{story.caption}</p>
                                    <button onClick={()=>deleteStory(story.id)} className="btn btn-danger">Delete</button>
                                </div>
                            </div>
                            <hr></hr>
                            </> 
                        })}
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-primary" data-bs-target="#createStoryForm" data-bs-toggle="modal">Back Create Story</button>
                    </div>
                </div>
            </div>
        </div>

    </>
}

export default StoryDeleteForm;