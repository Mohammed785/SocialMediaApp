import PostOptions from "./PostOptions"
import PostContent from "./PostContent"
import { IPost } from "../../../@types/post"

function SavedPost({ post, deletePost }: { post: IPost, deletePost: (id:number)=>void }){
    return <>
        <div className="bg-dark text-white p-4 rounded shadow mt-3">
            <div className="d-flex justify-content-between">
                <div className="d-flex">
                    <img src={`${process.env.REACT_APP_STATIC_PATH}${post.author.profileImg}`} alt="avatar" className="rounded-circle me-2" style={{ width: "38px", height: "38px", objectFit: "cover" }} />
                    <div>
                        <p className="m-0 fw-bold">{post.author.firstName} {post.author.lastName}</p>
                        <span className="text-white fs-7">{post.createTime}</span>
                    </div>
                </div>
                <PostOptions {...{ id: post.id, authorId: post.author.id, edited: post.edited, deletePost, saved: true }} />
            </div>
            <div className="mt-3">
                <PostContent {...{ id: post.id, images: post.images, body: post.body }} />
            </div>
        </div>
    </>
}

export default SavedPost