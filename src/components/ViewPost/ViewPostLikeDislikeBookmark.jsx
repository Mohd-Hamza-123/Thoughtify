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
      await updateLikeCount(post?.$id, like, dislike)
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