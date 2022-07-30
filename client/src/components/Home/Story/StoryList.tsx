import { FaArrowRight } from "react-icons/fa";
import StoryForm from "./StoryForm";
import Story from "./Story";
import axiosClient from "../../../axiosClient";
import { useEffect,useState } from "react";
import StoryModal from "./StoryModal";
import StoryUpdateForm from "./StoryDelete";
import { IStory } from "../../../@types/story";

function StatusList() {
    const [stories,setStories] = useState<IStory[]>([])
    const [story,setStory] = useState<IStory[]>([])
    const availableStories = async () => {
        try {
            const response = await axiosClient.get("/status/available");
            const data = response.data
            setStories(data.stories)
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(()=>{
        availableStories()
    },[])
    return <>
        <div className="mt-5 d-flex position-relative">
            <StoryForm/>
            <StoryUpdateForm/>
            {stories.length>0 && stories.map((story)=>{
                return <Story key={story.id} story={story} setStory={setStory} /> 
            })}
            <StoryModal story={story} />
            <div className=" position-absolute top-50 start-100 translate-middle pointer d-none d-lg-block">
                <FaArrowRight className="p-1 fs-3 border text-primary bg-white rounded-circle"></FaArrowRight>
            </div>
        </div>
    </>
}

export default StatusList; 