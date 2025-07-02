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

          {/* Comment card */ }
         return <div
            key={comment?.$id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 mb-5 shadow-md hover:shadow-xl transition-all duration-200"
          >
            <section>
              {/* Header */}
              <div className="flex justify-between items-start">
                <Link to={`/profile/${comment?.authId}`} id={`Comment${comment?.$id}`}>
                  <div className="flex gap-3 items-center cursor-pointer">
                    <img
                      className="w-11 h-11 rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-sm hover:scale-105 transition-transform"
                      src={profilePicURL}
                      alt="profilePic"
                    />
                    <span className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                      {comment?.name}
                    </span>
                  </div>
                </Link>

                <div>
                  {(userData?.$id === comment?.authId ||
                    userData?.$id === conf.myPrivateUserID) && (
                      <span
                        onClick={() => deleteComments(comment?.$id)}
                        className="cursor-pointer text-slate-500 hover:text-red-500 transition-colors"
                      >
                        <Icons.trashcan />
                      </span>
                    )}
                </div>
              </div>

              {/* Comment body */}
              <div className="mt-3 text-[15px] leading-relaxed text-slate-700 dark:text-slate-300 px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border-l-4 border-indigo-300 dark:border-indigo-500">
                {comment?.commentContent ? parse(comment?.commentContent) : ""}
              </div>
            </section>

            {/* Reply button */}
            <div id="ReplyDiv" className="flex justify-end mt-3">
              <span
                className="cursor-pointer bg-slate-900 dark:bg-slate-700 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow hover:shadow-md hover:scale-105 transition"
                onClick={() => setactiveTextArea(comment?.$id)}
              >
                Reply
              </span>
            </div>

            {/* Reply textarea */}
            <div className={`${activeTextArea === comment?.$id ? "" : "hidden"} mt-3`}>
              <textarea
                id={`id_${comment?.$id}`}
                rows="4"
                value={replyComment}
                className="w-full resize-y min-h-[72px] max-h-[260px] p-3 border rounded-lg bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-sm shadow-inner focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
                onChange={(e) => setReplyComment(e.target.value)}
              ></textarea>

              <Button
                onClick={() =>
                  subComment({
                    commentId: comment?.$id,
                    subComment: comment?.subComment,
                    userId: userData?.$id,
                    username: name,
                  })
                }
                className="mt-2 px-5 py-2 text-sm rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-medium shadow transition"
                type="submit"
              >
                Submit
              </Button>
            </div>

            {/* Sub comments */}
            <SubComment subComment={comment?.subComment} />

            {/* See replies */}
            <button
              className="mt-3 text-xs px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition"
              onClick={() => loadMoreSubComments(comment)}
            >
              {(loadSubComments_Five_Mul >= comment?.subComment?.length &&
                comment?.$id === id_For_Five_Mul) ||
                comment?.subComment?.length <= fixedReplies
                ? "No Replies"
                : "See Replies"}
            </button>

            {/* Date */}
            <div className="mt-2 text-xs text-slate-500">
              {new Date(comment?.$createdAt).toLocaleString()}
            </div>
          </div>

        })}
      </div>


    </div >
  );
};

export default Comments;

// {hasNextPage && < div className="flex justify-center" ref={spinnerRef}>
//   <Spinner />
// </div>}