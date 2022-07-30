import { IStory } from "../../../@types/story";
import axiosClient from "../../../axiosClient";

function Story({ story, setStory }: { story: IStory, setStory: (story:IStory[])=>void }){
    const getStoryImages = async()=>{
        try {            
            const response = await axiosClient.get(`/status/author/?id=${story.author.id}`)
            const data = response.data.status
            if(!data.length){
                // TODO:
            }
            setStory(data)
        } catch (error) {
            console.error(error);            
        }
    }
    return <>
        <div className="d-none d-lg-block rounded mx-1 story" onClick={getStoryImages} typeof="button" style={{ width: "6em", height: "190px" }} data-bs-toggle="modal" data-bs-target="#Story">
            {story.image ? <img src={process.env.REACT_APP_STATIC_PATH+story.image} crossOrigin='anonymous' className="card-img-top rounded" alt="story posts" style={{ minHeight: "150px", objectFit: "cover" }} />
            :<p className="card-img-top rounded story-text" style={{ minHeight: "130px", objectFit: "cover" }}>{story.caption}</p>
            }            
            <div className=" d-flex align-items-center justify-content-center position-relative" style={{ minHeight: "65px" }}>
                <div className="position-absolute top-0 start-50 translate-middle">
                    <img src={`${process.env.REACT_APP_STATIC_PATH}${story.author.profileImg}`} style={{width:"50px"}} className="text-primary bg-white p-1 rounded-circle"></img>
                </div>
            </div>
        </div>
    </>
}

export default Story;