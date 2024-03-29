import CommentForm from "./CommentForm";
import Comment from "./Comment"
import axiosClient from "../../../axiosClient";
import { useEffect, useState,UIEvent } from "react";
import { IComment } from "../../../@types/post";

interface ICommentListProps{
    postId: number
    updateCommentCount: (count:number)=>void
    commentable: boolean
    authorId?:number
}

function CommentList({ postId, updateCommentCount, commentable, authorId }:ICommentListProps){
    const [commentsQuery, setCommentsQuery] = useState<{ comments: IComment[],cursor:number }>({comments:[],cursor:0})
    const getComments = async()=>{
        try {
            const response = await axiosClient.get(`/comment/post/${postId}?cursor=${commentsQuery.cursor}`)
            const {cursor,comments} = response.data
            if(comments){
                setCommentsQuery({ comments: [...commentsQuery.comments,...comments], cursor: cursor})
            }else{
                setCommentsQuery({...commentsQuery,cursor:0})
            }
        } catch (error) {
            console.error(error);
        }
    }
    const updateComment = (id:number,newComment:IComment)=>{
        const comments = commentsQuery.comments.map(comment=>{
            if(comment.id===id){
                return {...comment,body:newComment.body,edited:true,updateTime:newComment.updateTime}
            }
            return comment
        })
        setCommentsQuery({...commentsQuery,comments})
    }
    const deleteComment = (id:number)=>{
        let cursor = (id === commentsQuery.cursor) ? Infinity: commentsQuery.cursor
        const comments = commentsQuery.comments.filter(comment=>{
            if(comment.id!==id && comment.id<cursor){
                cursor = comment.id
            }
            return comment.id!==id
        })
        setCommentsQuery({cursor,comments})
        updateCommentCount(-1)
    }
    const addComment = (comment:IComment)=>{
        setCommentsQuery({...commentsQuery,comments:[comment,...commentsQuery.comments]})
        updateCommentCount(1)
    }
    const handleScroll = async (e: UIEvent) => {
        if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop <= e.currentTarget!.clientHeight && commentsQuery.cursor!==0) {
            await getComments()
        }
    }
    useEffect(()=>{
        getComments()
    },[])
    return <>
        <div id={`collapsePost${postId}`} className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent={`#post${postId}Accordion`}>
            <hr />
            {commentable ? <CommentForm id={postId} addComment={addComment} authorId={authorId} />
            :<h5 className="text-center">Comments blocked on this post</h5>
            }
            <div onScroll={handleScroll} className="navbar-nav-scroll" style={{margin:"0.5rem"}}>
                {commentsQuery.comments.length>0 && commentsQuery.comments.map((comment)=>{
                    return  <Comment key={comment.id} {...{comment,updateComment,deleteComment}}/>
                })}
            </div>
        </div>
    </>
}
export default CommentList;