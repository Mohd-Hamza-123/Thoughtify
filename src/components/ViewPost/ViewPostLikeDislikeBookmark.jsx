import React, { memo, useState } from 'react';
import { Button } from '../ui/button';
import { FaThumbsUp } from "react-icons/fa6";
import { FaThumbsDown } from "react-icons/fa";
import { updateDislikeCount, updateLikeCount } from '@/lib/posts';
import { FaRegBookmark } from "react-icons/fa6";
import { userProfile } from '@/store/profileSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotificationContext } from '@/context/NotificationContext';

const ViewPostLikeDislikeBookmark = ({ post }) => {

  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const { setNotification } = useNotificationContext()
  const authStatus = useSelector((state) => state.auth.status)
  const myUserProfile = useSelector((state) => state?.profileSlice?.userProfile)
  
  const [likeState, setLikeState] = useState({
    like: post?.like,
    isLiked: myUserProfile?.likedQuestions?.includes(post?.$id)
  })
  const [disLikeState, setDisLikeState] = useState({
    dislike: post?.dislike,
    isDisliked: myUserProfile?.dislikedQuestions?.includes(post?.$id)
  })


  const { mutate } = useMutation({
    mutationFn: async (data) => {
      const { post, myUserProfile } = data
      return await updateLikeCount(post, myUserProfile)
    },
    onMutate: (variables) => {
      if (likeState.isLiked) {
        setLikeState((prev) => ({ ...prev, like: prev.like - 1, isLiked: false }))
      } else {
        setLikeState((prev) => ({ ...prev, like: prev.like + 1, isLiked: true }))
      }
    },
    onError: (error, variables, context) => {

    },
    onSuccess: (data, variables, context) => {

    },
    onSettled: (data, error, variables, context) => {
      updatePost(data?.post)
      const newProfile = data?.profile
      const newPost = data?.post
      setLikeState({
        like: newPost?.like,
        isLiked: newProfile?.likedQuestions?.includes(newPost?.$id)
      })
      dispatch(userProfile({ userProfile: data?.profile }))
    },
  })

  const { mutate: dislikeMutate } = useMutation({
    mutationFn: async (data) => {
      const { post, myUserProfile } = data
      return await updateDislikeCount(post, myUserProfile)
    },
    onMutate: (variables) => {
      if (disLikeState.isDisliked) {
        setDisLikeState((prev) => ({ ...prev, dislike: prev.dislike - 1, isDisliked: false }))
      } else {
        setDisLikeState((prev) => ({ ...prev, dislike: prev.dislike + 1, isDisliked: true }))
      }
    },
    onError: (error, variables, context) => {

    },
    onSuccess: (data, variables, context) => {

    },
    onSettled: (data, error, variables, context) => {
      updatePost(data?.post)
      const newProfile = data?.profile
      const newPost = data?.post
      setDisLikeState({
        dislike: newPost?.dislike,
        isDisliked: newProfile?.dislikedQuestions?.includes(newPost?.$id)
      })
      dispatch(userProfile({ userProfile: data?.profile }))
    },
  })



  const like_func = async () => {
    if (!authStatus) {
      setNotification({ message: "Please Login", type: "error" });
      return 
    }
    mutate({ post, myUserProfile })
  }

  const dislike_func = () => {
    if (!authStatus) {
      setNotification({ message: "Please Login", type: "error" });
      return;
    }
    dislikeMutate({ post, myUserProfile })
  }

  const bookMark_func = () => {
    if (!authStatus) {
      setNotification({ message: "Please Login", type: "error" });
      return;
    }
  }

  const isPostDisliked = () => {
    if (myUserProfile?.dislikedQuestions?.includes(post?.$id))
      return true
  }

  function updatePost(newPost) {
    queryClient.setQueryData(['post', post.$id], (oldData) => {
      return newPost
    })
  }

  return (
    <div className="flex justify-between gap-10 my-3">
      <Button
        variant='outline'
        className="flex-1"
        onClick={like_func}>
        <span className={`${likeState.isLiked ? "text-blue-500" : "text-black"}`}>
          {likeState.like}
        </span>
        <FaThumbsUp className={`${likeState.isLiked ? "fill-blue-500" : "fill-black"}`} />
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