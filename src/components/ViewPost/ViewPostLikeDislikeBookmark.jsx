import { Button } from '../ui/button';
import { useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react'
import { useNotificationContext } from '@/context/NotificationContext';


const ViewPostLikeDislikeBookmark = () => {

  const authStatus = useSelector((state) => state.auth.userStatus)

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

  return (
    <div className="flex justify-between gap-10 my-3">
      <Button
        variant='outline'
        className="flex-1"
        onClick={() => {
          if (pauseLikeDisLike) {
            setNotification({ message: "wait...", type: "success" });
            return
          }

          if (!authStatus) {
            setNotification({ message: "Please Login", type: "error" });
            return;
          }

          like_dislike_BookMark("Like");
          setLike_Dislike("liked");
          // if (myUserProfile?.likedQuestions?.includes(slug)) {
          //   setlikeCount((prev) => {
          //     if (prev === 0) return prev;
          //     return prev - 1;
          //   });
          // } else {
          //   setlikeCount((prev) => prev + 1);
          //   if (myUserProfile?.dislikedQuestions?.includes(slug)) {
          //     setdisLikeCount((prev) => {
          //       if (prev === 0) return prev;
          //       return prev - 1;
          //     });
          //   }
          // }
        }}
      >
        <span>{likeCount}</span>
        <i
          className={`fa-${Like_Dislike === "liked" ? "solid" : "regular"
            } fa-thumbs-up`}
        ></i>
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
        <i
          className={`fa-${Like_Dislike === "disliked" ? "solid" : "regular"
            } fa-thumbs-down`}
        ></i>

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
        <i
          className={`fa-${isBookMarked ? "solid" : "regular"
            } fa-bookmark`}
        ></i>
      </Button>
    </div>
  )
}

export default ViewPostLikeDislikeBookmark