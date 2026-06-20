import "./Chat.css";
import { toast } from "sonner"
import { Icons } from "../index";
import { Badge } from "@/components/ui/badge"
import { useState } from "react";
import conf from "../../conf/conf";
import { Button } from "../ui/button";
import parse from "html-react-parser";
import CommentRTE from "./CommentRTE";
import SubComment from "./SubComment";
import { useSelector } from "react-redux";
import realTime from "../../appwrite/realTime";
import { Link, useParams } from 'react-router-dom'
import React, { useEffect, useRef, useCallback, useMemo } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

const Comments = () => {

  const queryClient = useQueryClient();
  const { slug, filterCommentID } = useParams();
  const authStatus = useSelector((state) => state?.auth?.status)
  const userData = useSelector((state) => state?.auth?.userData)

  const textAreaRef = useRef(null)

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
    refetch,
  } = useInfiniteQuery({
    queryKey: ['comments', slug],
    queryFn: getComments,
    staleTime: Infinity,
    initialPageParam: null,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.nextCursor
    },

  })

  // console.log(data)

  const filteredComments = useMemo(() => {
    const comment = data?.pages?.flatMap(page => page.comments) ?? []
    return Array.from(new Map(comment.map(c => [c.$id, c])).values())
  }, [data?.pages])


  const [activeTextArea, setactiveTextArea] = useState(null)

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
      toast.success("Comment Deleted")
    } catch (err) {
      console.log(err.message);
      toast.error("Comment not Deleted")
    }
  };

  const subComment = async (e, commentId, commentArray) => {

    e.preventDefault()

    if (!authStatus) {
      toast.error("Please Login")
      return
    }
    if (!textAreaRef.current) {
      toast.error("Please enter comment")
      return
    }

    const value = textAreaRef.current.value


    // if (value.length > 100) {
    //   toast.error("You can't add more than 100 replies.")
    //   return
    // }

    const newPayload = JSON.stringify({
      comment: value,
      userId: userData.$id,
      username: userData.name,
    })

    console.log(newPayload)

    const newCommentArray = commentArray.concat(newPayload)

    const updatedComment = await realTime.updateComment({
      commentId,
      subComment: newCommentArray,
    })

    console.log(updatedComment)

    textAreaRef.current.value = ''

    refetch()
  }

  const deleteSubComment = async (index, commentId, subComment) => {

    const newCommentArray = subComment.filter((_, i) => i !== index);

    const updatedComment = await realTime.updateComment({
      commentId,
      subComment: newCommentArray,
    });

    console.log(updatedComment);

    refetch();

    toast.success("Comment Deleted");
  }


  return (
    <div className="w-full md:w-[70%] px-3 py-3">
      <CommentRTE slug={slug} />

      {filteredComments.map((comment) => {

        // console.log(comment)

        let profilePicURL = ''
        try {
          const parsed = JSON.parse(comment.profile.profileImage)
          profilePicURL = parsed.profileImageURL
        } catch (error) {
          console.log(error)
        }

        {/* Comment card */ }
        return <div
          key={comment?.$id}
          className="bg-white border border-slate-200 rounded-xl p-5 mb-5 shadow-md hover:shadow-xl transition-all duration-200 mt-3"
        >


          {/* Date */}
          <span className="my-2 text-xs text-slate-500">
            {new Date(comment?.$createdAt).toLocaleString()}
          </span>

          <section>
            {/* Header */}
            <div className="flex justify-between items-start">
              <Link to={`/profile/${comment?.profile?.$id}`} id={`Comment${comment?.$id}`}>
                <div className="flex gap-3 items-center cursor-pointer">
                  <img
                    className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm hover:scale-105 transition-transform"
                    src={profilePicURL}
                    alt="profilePic"
                  />
                  <span className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                    {comment?.name}
                  </span>
                </div>
              </Link>

              <div>
                {(userData?.$id === comment?.profile?.$id ||
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
          <form
            className={`${activeTextArea === comment?.$id ? "" : "hidden"} mt-3`}
            onSubmit={(e) => subComment(e, comment?.$id, comment?.subComment)}
          >
            <textarea
              id={`id_${comment?.$id}`}
              rows="4"
              ref={textAreaRef}
              className="w-full resize-y min-h-[72px] max-h-[260px] p-3 border rounded-lg bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-sm shadow-inner focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"

            ></textarea>

            <Button
              className="mt-2 px-5 py-2 text-sm rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-medium shadow transition"
              type="submit"

            >
              Submit
            </Button>
          </form>

          {/* Sub comments */}
          <SubComment
            subComment={comment?.subComment}
            deleteSubComment={deleteSubComment}
            commentId={comment?.$id}
          />

        </div>

      })}

    </div >
  );
};

export default Comments;

