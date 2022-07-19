import axiosClient from "../../../axiosClient";
import image from "../../img.jpg"
function Story({ story, setStory }: { story: Record<string,any>, setStory: Function }){
    const getStoryImages = async()=>{
        try {            
            const response = await axiosClient.get(`/status/author/?id=${story.author.id}`)
            const data = response.data.status
            console.log("Story: ",data);
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
            {story.image ? <img src={story.image} crossOrigin='anonymous' className="card-img-top rounded" alt="story posts" style={{ minHeight: "150px", objectFit: "cover" }} />
            :<p className="card-img-top rounded story-text" style={{ minHeight: "130px", objectFit: "cover" }}>{story.caption}</p>
            }            
            <div className=" d-flex align-items-center justify-content-center position-relative" style={{ minHeight: "65px" }}>
                <div className="position-absolute top-0 start-50 translate-middle">
                    <img src={image} style={{width:"50px"}} className="text-primary bg-white p-1 rounded-circle"></img>
                </div>
            </div>
        </div>
    </>
}

export default Story;