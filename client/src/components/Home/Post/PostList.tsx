import { useEffect, useState } from "react";
import { IPost } from "../../../@types/post";
import axiosClient from "../../../axiosClient";
import Post from "./Post";
import SavedPost from "./SavedPost";

function PostList({ postsType, userId, groupId }: { postsType: string, userId?: string | number, groupId?: string | number }){
    const [posts,setPosts] = useState<{posts:IPost[],cursor:number}>({posts:[],cursor:0})
    async function getPosts(){
        try {
            let url = `/post?cursor=${posts.cursor}&id=${userId}`
            if(postsType==="saved"){
                url =  `/post/saved?cursor=${posts.cursor}`
            }else if(postsType==='group') url = `/post/group/${groupId}?cursor=${posts.cursor}`
            else if(postsType==='feed') url=`/post/feed?cursor=${posts.cursor}`
            const response = await axiosClient.get(url)
            const {posts:newPosts,cursor} = response.data
            setPosts({posts:[...posts.posts,...newPosts],cursor:cursor})
        } catch (error) {
            console.error(error);
        }
    }
    const deletePost = (id:number)=>{
        let cursor = (id === posts.cursor) ? Infinity : posts.cursor
        const newPosts = posts.posts.filter(post => {
            if (post.id !== id && post.id < cursor) {
                cursor = post.id
            }
            return post.id !== id
        })
        setPosts({ cursor, posts: newPosts })
    }
    useEffect(()=>{
        function checkScroll(e:Event){
            if ((window.scrollY + window.innerHeight) >= document.body.scrollHeight && posts.cursor !== 0){
                getPosts()
            }
        }
        window.addEventListener("scroll",checkScroll)
        return ()=>window.removeEventListener("scroll",checkScroll)
    },[posts.cursor])
    useEffect(()=>{
        getPosts()
    },[])
    return <>
    {posts.posts && posts.posts.map((post)=>{
        if(postsType==='saved'){
            return <SavedPost key={post.id} post={post} deletePost={deletePost} />
        }else{
            return <Post key={post.id} post={post} deletePost={deletePost}/>
        }
    })}
    {posts.cursor===0 && <p className="text-center mt-3 mb-0 fw-bold" style={{fontSize:"2em"}}>No More Posts</p>}
    </>
}

export default PostList;