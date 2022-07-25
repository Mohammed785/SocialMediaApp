import PostList from "../components/Home/Post/PostList";

function SavedPosts(){
    return <>
        <div className="col-12 col-lg-6 pb-5">
            <div className="d-flex flex-column justify-content-center w-100 mx-auto" style={{ paddingTop: "56px", maxWidth: "680px" }}>
                <PostList postsType={"saved"}/>
            </div>
        </div>
    </>

}

export default SavedPosts;