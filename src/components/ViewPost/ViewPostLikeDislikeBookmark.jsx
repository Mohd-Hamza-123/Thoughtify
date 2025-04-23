import { Button } from '../ui/button';
import { useSelector } from 'react-redux';
import { FaThumbsUp } from "react-icons/fa6";
import { FaThumbsDown } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import React, { useState, useEffect } from 'react'
import { useNotificationContext } from '@/context/NotificationContext';
import { updateLikeCount } from '@/lib/posts';

const ViewPostLikeDislikeBookmark = ({ post }) => {
  const { $id, like, dislike } = post
  // console.log($id, like, dislike)

  const authStatus = useSelector((state) => state.auth.status)
  const myUserProfile = useSelector((state) => state?.profileSlice?.userProfile)
  // console.log(myUserProfile)
  const [isBookMarked, setIsBookMarked] = useState(false);
  const [Like_Dislike, setLike_Dislike] = useState(null);
  const [disLikeCount, setDisLikeCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);


  const { setNotification } = useNotificationContext()

  const [pauseLikeDisLike, setPauseLikeDisLike] = useState(false);

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



  const like_func = async () => {

    if (pauseLikeDisLike) {
      setNotification({ message: "wait...", type: "success" });
      return
    }

    if (!authStatus) {
      setNotification({ message: "Please Login", type: "error" });
      return undefined
    }

    // like_dislike_BookMark("Like");
    // setLike_Dislike("liked");
    if (myUserProfile?.likedQuestions?.includes(post?.$id)) {
      console.log("already liked")
      console.log(post)
      //   setlikeCount((prev) => {
      //     if (prev === 0) return prev;
      //     return prev - 1;
      //   });
    }
    else {
      console.log("not liked")
      console.log(post)
      await updateLikeCount($id, like, dislike)
      //   setlikeCount((prev) => prev + 1);
      //   if (myUserProfile?.dislikedQuestions?.includes(slug)) {
      //     setdisLikeCount((prev) => {
      //       if (prev === 0) return prev;
      //       return prev - 1;
      //     });
      //   }

    }
  }

  const dislike_func = () => {

  }

  const bookMark_func = () => {
  }

  // if (flag === "Like") {
  //   try {
  //     if (likedQuestionsInContext.includes(post?.$id)) {
  //       // update in Query
  //       const increaseLike = await appwriteService.updatePost_Like_DisLike({
  //         postId: post?.$id,
  //         like: previousLike - 1,
  //         dislike: previousDislike,
  //       });
  //       setPost((prev) => increaseLike);
  //       dispatch(
  //         getAllVisitedQuestionsInViewPost({ questions: increaseLike })
  //       );

  //       //Update In Profile
  //       let likedQuestions = likedQuestionsInContext.filter(
  //         (likedPostIDs) => likedPostIDs !== post?.$id
  //       );

  //       const updateLikeArr_In_MyProfile =
  //         await profile.updateProfileWithQueries({
  //           profileID: myUserProfile?.$id,
  //           likedQuestions,
  //           dislikedQuestions: dislikedQuestionsInContext,
  //           bookmarks: bookmarksInContext,
  //         });

  //       setMyUserProfile((prev) => updateLikeArr_In_MyProfile);
  //     } else {
  //       if (dislikedQuestionsInContext.includes(post?.$id)) {
  //         // Update in Query
  //         const increaseLike = await appwriteService.updatePost_Like_DisLike({
  //           postId: post?.$id,
  //           like: previousLike + 1,
  //           dislike: previousDislike - 1,
  //         });
  //         dispatch(
  //           getAllVisitedQuestionsInViewPost({ questions: increaseLike })
  //         );
  //         setPost((prev) => increaseLike);

  //         //Update In Profile
  //         let likedQuestions = [...likedQuestionsInContext];
  //         likedQuestions.push(post?.$id);

  //         let dislikedQuestions = dislikedQuestionsInContext.filter(
  //           (dislikedPostIDs) => dislikedPostIDs !== post?.$id
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
  //         // Update in Query
  //         const increaseLike = await appwriteService.updatePost_Like_DisLike({
  //           postId: post?.$id,
  //           like: previousLike + 1,
  //           dislike: previousDislike,
  //         });

  //         dispatch(
  //           getAllVisitedQuestionsInViewPost({ questions: increaseLike })
  //         );
  //         setPost((prev) => increaseLike);

  //         //Update In Profile
  //         let likedQuestions = [...likedQuestionsInContext];
  //         likedQuestions.push(post?.$id);

  //         const updateLikeArr_In_MyProfile =
  //           await profile.updateProfileWithQueries({
  //             profileID: myUserProfile?.$id,
  //             likedQuestions,
  //             dislikedQuestions: dislikedQuestionsInContext,
  //             bookmarks: bookmarksInContext,
  //           });

  //         setMyUserProfile((prev) => updateLikeArr_In_MyProfile);
  //       }

  //       try {
  //         if (userData?.$id !== post?.userId) {
  //           // Getting Post Uploader profile to know whether he follows you or not.
  //           const getPostUploaderProfile = await profile?.listProfile({
  //             slug: post?.userId,
  //           });

  //           let followersArr =
  //             getPostUploaderProfile?.documents[0]?.followers;
  //           followersArr = followersArr?.map((obj) => JSON.parse(obj));

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

  return (
    <div className="flex justify-between gap-10 my-3">
      <Button
        variant='outline'
        className="flex-1"
        onClick={like_func}
      >
        <span>{likeCount}</span>
        <FaThumbsUp className={`${Like_Dislike ? "font-bold" : "font-normal"}`} />
      </Button>

      <Button
        variant='outline'
        className="flex-1"
        onClick={() => {
          if (pauseLikeDisLike) {
            setNotification({ message: "wait...", type: "success" });
            return;
          }
          if (!authStatus) {
            setNotification({ message: "Please Login", type: "error" });
            return;
          }

          like_dislike_BookMark("Dislike");
          setLike_Dislike("disliked");
          // if (myUserProfile?.dislikedQuestions?.includes(slug)) {
          //   setdisLikeCount((prev) => {
          //     if (prev === 0) return prev;
          //     return prev - 1;
          //   });
          // } else {
          //   setdisLikeCount((prev) => prev + 1);

          //   if (myUserProfile?.likedQuestions?.includes(slug)) {
          //     setlikeCount((prev) => {
          //       if (prev === 0) return prev;
          //       return prev - 1;
          //     });
          //   }
          // }
        }}
      >

        <span>{disLikeCount}</span>
        <FaThumbsDown className={`${Like_Dislike ? "font-bold" : "font-normal"}`} />
      </Button>

      <Button
        className="flex-1"
        variant='outline'
        onClick={() => {
          if (pauseLikeDisLike) {
            setNotification({ message: "wait...", type: "success" });
            return;
          }

          if (!authStatus) {
            setNotification({ message: "Please Login", type: "error" });
            return;
          }
          like_dislike_BookMark("BooKMark");
          // setIsBookMarked((prev) => !prev);
        }}
      >
        <FaRegBookmark className={`${isBookMarked ? "font-bold fill-black" : "font-normal"}`} />
      </Button>
    </div>
  )
}

export default ViewPostLikeDislikeBookmark