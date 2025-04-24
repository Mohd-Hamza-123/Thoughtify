import { Button } from '../ui/button';
import { useSelector } from 'react-redux';
import { FaThumbsUp } from "react-icons/fa6";
import { FaThumbsDown } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import React, { memo } from 'react'
import { updateLikeCount } from '@/lib/posts';
import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { userProfile } from '@/store/profileSlice';
import { useNotificationContext } from '@/context/NotificationContext';

const ViewPostLikeDislikeBookmark = ({ post }) => {

  const dispatch = useDispatch()

  const authStatus = useSelector((state) => state.auth.status)
  const myUserProfile = useSelector((state) => state?.profileSlice?.userProfile)
  // console.log(myUserProfile)

  const { setNotification } = useNotificationContext()


  const mutationLike = useMutation({
    mutationFn: async (data) => {
      const { post, myUserProfile } = data
      return await updateLikeCount(post, myUserProfile)
    },
    onMutate: (variables) => {

    },
    onError: (error, variables, context) => {
      console.log(error)
    },
    onSuccess: (data, variables, context) => {
      console.log(data)
      dispatch(userProfile({ userProfile: data?.profile }))
    },
    onSettled: (data, error, variables, context) => {

    },
  })


  const like_func = async () => {
    if (!authStatus) {
      setNotification({ message: "Please Login", type: "error" });
      return undefined
    }
    mutationLike.mutate({ post, myUserProfile })
  }

  const dislike_func = () => {
    if (!authStatus) {
      setNotification({ message: "Please Login", type: "error" });
      return;
    }
  }

  const bookMark_func = () => {
    if (!authStatus) {
      setNotification({ message: "Please Login", type: "error" });
      return;
    }
  }

  const isPostLiked = () => {
    if (myUserProfile?.likedQuestions?.includes(post?.$id))
      return true
  }

  const isPostDisliked = () => {
    if (myUserProfile?.dislikedQuestions?.includes(post?.$id))
      return true
  }

  return (
    <div className="flex justify-between gap-10 my-3">
      <Button
        variant='outline'
        className="flex-1"
        onClick={like_func}
      >
        <span className={`${isPostLiked() ? "text-blue-500" : "text-black"}`}>{post?.like}</span>
        <FaThumbsUp className={`${isPostLiked() ? "fill-blue-500" : "fill-black"}`} />
      </Button>

      <Button
        variant='outline'
        className="flex-1"
        onClick={dislike_func}>
        <span className={`${isPostDisliked() ? "text-blue-500" : "text-black"}`}>{post?.dislike}</span>
        <FaThumbsDown className={`${isPostDisliked() ? "fill-blue-500" : "fill-black"}`} />
      </Button>

      <Button
        className="flex-1"
        variant='outline'
        onClick={bookMark_func}>
        <FaRegBookmark className={`${true ? "font-bold fill-black" : "font-normal"}`} />
      </Button>
    </div>
  )
}

export default memo(ViewPostLikeDislikeBookmark)