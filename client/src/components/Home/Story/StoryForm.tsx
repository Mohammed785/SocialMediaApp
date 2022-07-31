import { FaPlusCircle } from "react-icons/fa";
import { useAuthContext } from "../../../context/authContext";
import StoryCreateForm from "./StoryCreate";
import StoryDeleteForm from "./StoryDelete";


function StoryForm(){
    const {user} = useAuthContext()!
    return <>
        <div className="mx-1 rounded story" style={{ cursor: "pointer", width: "6em", height: "190px" }} data-bs-toggle="modal" data-bs-target="#createStoryForm">
            <img src={`${process.env.REACT_APP_STATIC_PATH}${user!.profileImg}`} className="card-img-top"
                alt="story posts" style={{ minHeight: "125px", objectFit: "cover" }} />
            <div className=" d-flex align-items-center justify-content-center position-relative" style={{ minHeight: "65px", backgroundColor: "#252a30", color: "white" }}>
                <p className="mb-0 text-center fs-7 fw-bold">Create Story</p>
                <div className="position-absolute top-0 start-50 translate-middle">
                    <FaPlusCircle className="text-primary p-1 fs-3 rounded-circle"></FaPlusCircle>
                </div>
            </div>
        </div>
        <StoryCreateForm/>
        <StoryDeleteForm/>
    </>
}

export default StoryForm;