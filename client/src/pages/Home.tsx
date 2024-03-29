import PostForm from "../components/Home/Post/PostForm"
import StoryList from "../components/Home/Story/StoryList"
import "../components/Home/home.css"
import PostList from "../components/Home/Post/PostList"
import useTitle from "../hooks/useTitle"

function Home() {
    useTitle("Home")
    return <>
        <div className="col-12 col-lg-6 pb-5">
            <div className="d-flex flex-column justify-content-center w-100 mx-auto" style={{ paddingTop: "56px", maxWidth: "680px" }}>
                <StoryList/>
                <PostForm/>
                <PostList postsType="feed"/>
            </div>
        </div>
    </>
}

export default Home