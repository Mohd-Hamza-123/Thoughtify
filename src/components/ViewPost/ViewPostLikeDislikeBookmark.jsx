import { Button } from '../ui/button';
import { useSelector } from 'react-redux';
import { FaThumbsUp } from "react-icons/fa6";
import { FaThumbsDown } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import React, { useState, useEffect } from 'react'
import { useNotificationContext } from '@/context/NotificationContext';
import { updateLikeCount } from '@/lib/posts';
import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { userProfile } from '@/store/profileSlice';

const ViewPostLikeDislikeBookmark = ({ post }) => {

  const dispatch = useDispatch()
  const { $id, like, dislike } = post


  const authStatus = useSelector((state) => state.auth.status)
  const myUserProfile = useSelector((state) => state?.profileSlice?.userProfile)
  // console.log(myUserProfile)
  const [isBookMarked, setIsBookMarked] = useState(false);


  const { setNotification } = useNotificationContext()


  // UseEffect For bookMark
  // useEffect(() => {
  //   if (myUserProfile?.bookmarks?.includes(post?.$id)) {
  //     setIsBookMarked(true);
  //   } else {
  //     setIsBookMarked(false);
  //   }

  //   if (post) {
  //     if (post?.pollVotersID.length === 0) {
  //       setselectedIndex((prev) => null);
  //     } else {
  //       let parseArr = post?.pollVotersID?.map((obj) => JSON.parse(obj));
  //       let myPollIndex = parseArr?.filter(
  //         (obj) => obj?.pollVoterID === userData?.$id
  //       );
  //       if (myPollIndex?.length === 0) {
  //         setselectedIndex(null);
  //       } else {
  //         setselectedIndex((prev) => myPollIndex[0]?.optionNum);
  //       }
  //     }

  //     setlikeCount((prev) => post?.like);
  //     setdisLikeCount((prev) => post?.dislike);
  //   }

  //   if (post === undefined) {
  //     let postObject = initialPost.find((obj) => obj.$id === slug);
  //     setPost((prev) => postObject);
  //   }
  // }, [post]);
  // +(
  //   // UseEffect For bookMark
  //   useEffect(() => {
  //     if (myUserProfile?.bookmarks?.includes(post?.$id)) {
  //       setIsBookMarked(true);
  //     } else {
  //       setIsBookMarked(false);
  //     }

  //     if (myUserProfile) {
  //       if (myUserProfile?.likedQuestions?.includes(slug)) {
  //         setLike_Dislike((prev) => "liked");
  //       } else if (myUserProfile?.dislikedQuestions?.includes(slug)) {
  //         setLike_Dislike((prev) => "disliked");
  //       } else {
  //         setLike_Dislike((prev) => "none");
  //       }
  //     }
  //   }, [myUserProfile])
  // );


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

  const like_dislike_BookMark = async (flag) => {

    // if (flag === "Like") {
    //   try {
    //       }

    //           const isNotificationSend = followersArr?.findIndex(
    //             (profile) => profile?.profileID === userData?.$id
    //           );

    //           if (isNotificationSend !== -1) {
    //             const createNotification =
    //               await notification.createNotification({
    //                 content: `${userData.name} has liked your post`,
    //                 isRead: false,
    //                 slug: `/post/${slug}/null`,
    //                 name: userData?.name,
    //                 userID: userData.$id,
    //                 userIDofReceiver: post.userId,
    //                 userProfilePic: myUserProfile?.profileImgURL,
    //               });
    //           }
    //         }
    //       } catch (error) {
    //         return null;
    //       }
    //     }
    //   } catch (error) {
    //     return null;
    //   }
    // } else if (flag === "Dislike") {
    //   try {
    //     if (dislikedQuestionsInContext.includes(post?.$id)) {
    //       // update in Query
    //       const decreaseDislike = await appwriteService.updatePost_Like_DisLike(
    //         {
    //           postId: post?.$id,
    //           like: previousLike,
    //           dislike: previousDislike - 1,
    //         }
    //       );
    //       setPost((prev) => decreaseDislike);
    //       dispatch(
    //         getAllVisitedQuestionsInViewPost({ questions: decreaseDislike })
    //       );

    //       //Update In Profile
    //       let dislikedQuestions = dislikedQuestionsInContext.filter(
    //         (dislikedPostIDs) => dislikedPostIDs !== post?.$id
    //       );

    //       const updateDislikeArr_In_MyProfile =
    //         await profile.updateProfileWithQueries({
    //           profileID: myUserProfile?.$id,
    //           likedQuestionsInContext,
    //           dislikedQuestions: dislikedQuestions,
    //           bookmarks: bookmarksInContext,
    //         });

    //       setMyUserProfile((prev) => updateDislikeArr_In_MyProfile);
    //     } else {
    //       if (likedQuestionsInContext?.includes(post?.$id)) {
    //         // Update in Query
    //         const increaseDislike =
    //           await appwriteService.updatePost_Like_DisLike({
    //             postId: post?.$id,
    //             like: previousLike - 1,
    //             dislike: previousDislike + 1,
    //           });
    //         dispatch(
    //           getAllVisitedQuestionsInViewPost({ questions: increaseDislike })
    //         );
    //         setPost((prev) => increaseDislike);

    //         //Update In Profile
    //         let dislikedQuestions = [...dislikedQuestionsInContext];
    //         dislikedQuestions?.push(post?.$id);

    //         let likedQuestions = likedQuestionsInContext?.filter(
    //           (likedPostIDs) => likedPostIDs !== post?.$id
    //         );
    //         const updateLikeArr_In_MyProfile =
    //           await profile.updateProfileWithQueries({
    //             profileID: myUserProfile?.$id,
    //             likedQuestions,
    //             dislikedQuestions,
    //             bookmarks: bookmarksInContext,
    //           });

    //         setMyUserProfile((prev) => updateLikeArr_In_MyProfile);
    //       } else {
    //         const increaseDisLike =
    //           await appwriteService.updatePost_Like_DisLike({
    //             postId: post?.$id,
    //             like: previousLike,
    //             dislike: previousDislike + 1,
    //           });

    //         dispatch(
    //           getAllVisitedQuestionsInViewPost({ questions: increaseDisLike })
    //         );
    //         setPost((prev) => increaseDisLike);

    //         //Update In Profile
    //         let dislikedQuestions = [...dislikedQuestionsInContext];
    //         dislikedQuestions.push(post?.$id);

    //         const updateLikeArr_In_MyProfile =
    //           await profile.updateProfileWithQueries({
    //             profileID: myUserProfile?.$id,
    //             likedQuestionsInContext,
    //             dislikedQuestions: dislikedQuestions,
    //             bookmarks: bookmarksInContext,
    //           });

    //         setMyUserProfile((prev) => updateLikeArr_In_MyProfile);
    //       }
    //     }
    //   } catch (error) {
    //     return null;
    //   }
    // } else {
    //   if (bookmarksInContext?.includes(post?.$id)) {
    //     const removeBookmark = bookmarksInContext?.filter(
    //       (bookmarkPostID) => bookmarkPostID !== post?.$id
    //     );

    //     const updateBookMarkInProfile = await profile.updateProfileWithQueries({
    //       profileID: myProfileID_In_Context,
    //       likedQuestions: likedQuestionsInContext,
    //       dislikedQuestions: dislikedQuestionsInContext,
    //       bookmarks: removeBookmark,
    //     });
    //     setMyUserProfile((prev) => updateBookMarkInProfile);
    //   } else {
    //     let addBookmark = [...bookmarksInContext];
    //     addBookmark?.push(post?.$id);

    //     const updateBookMarkInProfile = await profile.updateProfileWithQueries({
    //       profileID: myProfileID_In_Context,
    //       likedQuestions: likedQuestionsInContext,
    //       dislikedQuestions: dislikedQuestionsInContext,
    //       bookmarks: addBookmark,
    //     });
    //     setMyUserProfile((prev) => updateBookMarkInProfile);
    //   }
    // }
  };


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
        onClick={bookMark_func}
      >
        <FaRegBookmark className={`${isBookMarked ? "font-bold fill-black" : "font-normal"}`} />
      </Button>
    </div>
  )
}

export default ViewPostLikeDislikeBookmark