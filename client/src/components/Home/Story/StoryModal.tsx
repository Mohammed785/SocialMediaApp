import axios from "axios";
import { useEffect, useState } from "react";
import axiosClient from "../../../axiosClient";
import captionImage from "./img.jpg"

function StoryModal({story}:{story:Record<string,any>[]}){
    const [currentView,setCurrentView] = useState(0)
    const [viewed,setViewed] = useState<number[]>([])
    async function viewStory(){
        try {
            if (!viewed.includes(story[currentView].id)){
                const response = await axiosClient.post(`/status/${story[currentView].id}/view`)
                setViewed([...viewed, story[currentView].id])
            }
        } catch (error) {
            if(axios.isAxiosError(error)){
                if((error.response?.data as Record<string,any>).code="P2002"){
                    setViewed([...viewed, story[currentView].id])
                }
            }
            console.error(error);
        }
    }
    useEffect(()=>{
        if(story.length){
            viewStory()
        }
    },[currentView])
    useEffect(()=>{
        setCurrentView(0)
    },[story])
    return <>
        <div className="modal fade" id="Story" tabIndex={-1} data-bs-keyboard="false" data-bs-backdrop="static" aria-labelledby="Story Form" aria-hidden="true">
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="carousel slide" id="carousel-img" data-bs-ride="false">
                            <div className="carousel-indicators">
                                {story.map((st,i)=>{
                                    return <button key={i} type="button" data-bs-target="#carousel-img" data-bs-slide-to={i} className={i === 0 ?"active":""} aria-current="true" aria-label={`Slide ${i+1}`}></button>
                                })}
                            </div>
                            <div className="carousel-inner">
                                {story.map((st,i)=>{
                                    return <div key={st.id} className={i === 0 ? "carousel-item active" :"carousel-item"}>                                       
                                        {st.image ? <img src={st.image} crossOrigin='anonymous' className="d-block w-100" alt="story image" />
                                            : <img src={captionImage} className="d-block w-100" alt="paper image" />}
                                        {st.caption && 
                                            <div className={`carousel-caption d-none d-md-block ${(st.image===null && "carousel-text")}`}>
                                                <p>{st.caption}</p>
                                            </div>
                                        }
                                    </div>                                    
                                })}                              
                            </div>
                            <button className="carousel-control-prev" type="button" data-bs-target="#carousel-img" data-bs-slide="prev">
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Previous</span>
                            </button>
                            <button className="carousel-control-next" onClick={() => setCurrentView((currentView + 1) % story.length)} type="button" data-bs-target="#carousel-img" data-bs-slide="next">
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Next</span>
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default StoryModal