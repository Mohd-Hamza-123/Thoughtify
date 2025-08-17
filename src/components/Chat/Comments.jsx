import "./Chat.css";
import { useState } from "react";
import conf from "../../conf/conf";
import { Button } from "../ui/button";
import parse from "html-react-parser";
import { Icons, Spinner } from "../index";
import CommentRTE from "./CommentRTE";
import SubComment from "./SubComment";
import { useSelector } from "react-redux";
import realTime from "../../appwrite/realTime";
import React, { useEffect, useRef, useCallback, useMemo } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useNotificationContext } from "@/context/NotificationContext";

const Comments = () => {

  const { slug, filterCommentID } = useParams();
  const queryClient = useQueryClient();
  const getComments = useCallback(async (object) => {
    const { pageParam: lastCommentId } = object

    const data = await realTime.listComment(slug, lastCommentId);
  
    const commentsLength = data?.documents?.length
    return {
      comments: data?.documents,
      nextCursor: commentsLength ? data.documents[commentsLength - 1]?.$id : undefined
    }
  }, [])


  const {
    data,
    hasNextPage,
    fetchNextPage,
    isPending,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ['comments', slug],
    queryFn: getComments,
    staleTime: Infinity,
    initialPageParam: null,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.nextCursor
    },

  })

  const filteredComments = useMemo(() => {
    const comment = data?.pages?.flatMap(page => page.comments) ?? []
    return Array.from(new Map(comment.map(c => [c.$id, c])).values())
  }, [data?.pages])

  // console.log(comments)

  const navigate = useNavigate()

  const authStatus = useSelector((state) => state?.auth?.status)
  const userData = useSelector((state) => state?.auth?.userData)

  const { setNotification } = useNotificationContext()

  const fixedReplies = 2;
  const [replyComment, setReplyComment] = useState("");
  const [activeTextArea, setactiveTextArea] = useState(null)
  const [id_For_Five_Mul, setid_For_Five_Mul] = useState(null)
  const [loadSubComments_Five_Mul, setloadSubComments_Five_Mul] = useState(2)

  let spinnerRef = useRef();

  useEffect(() => {
    const ref = spinnerRef.current;

    if (ref) {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          fetchNextPage()
        }
      }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      })

      observer.observe(ref)
      return () => ref && observer.unobserve(ref)
    }

  }, [hasNextPage, fetchNextPage])

  const deleteComments = async (documentid) => {
    try {
      await realTime.deleteComment(documentid);
      setNotification({ message: "Comment Deleted", type: "success" });

      // remove from query cache
      queryClient.setQueryData(['comments', slug], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            comments: page.comments.filter((c) => c.$id !== documentid),
          })),
        };
      });
    } catch (err) {
      console.log(err.message);
       setNotification({ message: "Comment not Deleted", type: "error" });
    }
  };

  const subComment = async (data) => {

    if (!authStatus) {
      setNotification({ message: "Please Login", type: 'error' })
      return
    }
    const { subComment, userId, username, commentId } = data

    if (subComment?.length > 100) {
      setNotification({ message: "You can't add more than 100 replies.", type: 'error' })
      return
    }

    const newPayload = JSON.stringify({
      comment: replyComment,
      userId,
      username,
    })

    subComment.push(newPayload)

    const updatedComment = await realTime.updateComment({
      commentId,
      subComment,
    })
    // console.log(updatedComment)

    setReplyComment((prev) => '')
  }

  const loadMoreSubComments = (comment) => {
    setid_For_Five_Mul((prev) => comment?.$id)
    const currentCommentID = comment?.$id;
    if (currentCommentID !== id_For_Five_Mul && id_For_Five_Mul !== null) {
      setloadSubComments_Five_Mul((prev) => fixedReplies + 2)
    }
    if (loadSubComments_Five_Mul >= comment?.subComment?.length) return

    setloadSubComments_Five_Mul((prev) => prev + 3)
  }

  return (
    <div className="w-full md:w-[70%] px-3 py-3">
      <CommentRTE slug={slug} />
      <div>
        {filteredComments?.map((comment) => {
          // console.log(comment)
          const profilePicURL = 'https://images.pexels.com/photos/33029806/pexels-photo-33029806.jpeg'

          return <div key={comment?.$id} className="Chat_Comment_Div">
            <section>
              <div className="flex justify-between">

                <Link
                  to={`/profile/${comment?.authId}`}
                  id={`Comment${comment?.$id}`}>
                  <div className="flex gap-2 cursor-pointer">
                    <img
                      className="Chat_Comment_Div_img"
                      src={profilePicURL}
                      alt="profilePic"
                    />
                    <span className="font-bold Chat_Comment_Name">{comment?.name}</span>
                  </div>
                </Link>
                <div>
                  {(userData?.$id === comment?.authId || userData?.$id === conf.myPrivateUserID) && (
                    <span
                      onClick={() => deleteComments(comment?.$id)}
                      className="cursor-pointer">
                      <Icons.trashcan />
                    </span>
                  )}
                </div>

              </div>


              <div className="Chat_Comment">
                {comment?.commentContent ? parse(comment?.commentContent) : ''}</div>

            </section>

            <div id="ReplyDiv" className="flex justify-end mt-3">
              <span
                className="cursor-pointer"
                onClick={() => setactiveTextArea(comment?.$id)}>
                Reply
              </span>
            </div>

            <div className={`${activeTextArea === comment?.$id ? '' : 'hidden'}`}>
              <textarea
                name=""
                id={`id_${comment?.$id}`}
                rows="4"
                value={replyComment}
                className="Chat_textArea"
                onChange={(e) => setReplyComment(e.target.value)}
              ></textarea>

              <Button
                onClick={() => subComment({
                  commentId: comment?.$id,
                  subComment: comment?.subComment,
                  userId: userData?.$id,
                  username: name,
                })}
                className="Chat-Comment-Reply"
                value="Submit"
                type="submit">
                Submit
              </Button>
            </div>


            <SubComment subComment={comment?.subComment} />

            <button className="Chat_See_Replies"
              onClick={() => { loadMoreSubComments(comment) }}>
              {`${(loadSubComments_Five_Mul >= comment?.subComment?.length && comment?.$id === id_For_Five_Mul) || comment?.subComment?.length <= fixedReplies ? 'No Replies' : 'See Replies'}`}</button>
            <div>
              {new Date(comment?.$createdAt).toLocaleString()}
            </div>
          </div>
        })}
      </div>

      {hasNextPage && < div className="flex justify-center" ref={spinnerRef}>
        <Spinner />
      </div>}

    </div >
  );
};

export default Comments;
