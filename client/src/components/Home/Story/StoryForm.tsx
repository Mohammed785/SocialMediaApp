import { FaPlusCircle } from "react-icons/fa";
import StoryCreateForm from "./StoryCreate";
import StoryDeleteForm from "./StoryDelete";


function StoryForm(){
    
    return <>
        <div className="mx-1 bg-white rounded story" style={{ cursor: "pointer", width: "6em", height: "190px" }} data-bs-toggle="modal" data-bs-target="#createStoryForm">
            <img src='#' className="card-img-top"
                alt="story posts" style={{ minHeight: "125px", objectFit: "cover" }} />
            <div className=" d-flex align-items-center justify-content-center position-relative" style={{ minHeight: "65px" }}>
                <p className="mb-0 text-center fs-7 fw-bold">Create Story</p>
                <div className="position-absolute top-0 start-50 translate-middle">
                    <FaPlusCircle className="text-primary bg-white p-1 fs-3 rounded-circle"></FaPlusCircle>
                </div>
            </div>
        </div>
        <StoryCreateForm/>
        <StoryDeleteForm/>
    </>
}

export default StoryForm;