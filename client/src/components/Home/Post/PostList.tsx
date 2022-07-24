import { useEffect, useState } from "react";
import axiosClient from "../../../axiosClient";
import Post from "./Post";

function PostList(){
    const [posts,setPosts] = useState<{posts:Record<string,any>[],cursor:number}>({posts:[],cursor:0})
    async function getPosts(){
        try {
            const response = await axiosClient.get(`/post?cursor=${posts.cursor}`)
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
    {posts.posts && posts.posts.map((post:Record<string,any>)=>{        
        return <Post key={post.id} post={post} deletePost={deletePost}/>
    })}
    {posts.cursor===0 && <p className="text-center mt-3 mb-0 fw-bold" style={{fontSize:"2em"}}>No More Posts</p>}
    </>
}

export default PostList;