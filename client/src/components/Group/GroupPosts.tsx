import PostList from "../Home/Post/PostList"

function GroupPosts({id}:{id:number}){
    return <>
    <PostList postsType="group" groupId={id}/>
    </>
}
export default GroupPosts