import React from 'react'
import { Button } from '../ui/button';


const ViewPostLikeDislikeBookmark = () => {
  return (
    <div className="flex justify-between gap-10 my-3">
      <Button
        variant='outline'
        className="flex-1"
        onClick={() => {
          if (pauseLikeDisLike) {
            setNotificationPopMsgNature((prev) => false);
            setnotificationPopMsg((prev) => "wait...");
            return;
          }

          if (!userAuthStatus) {
            setNotificationPopMsgNature((prev) => false);
            setnotificationPopMsg("Please Login");
            return;
          }

          like_dislike_BookMark("Like");
          setLike_Dislike((prev) => "liked");
          if (myUserProfile?.likedQuestions?.includes(slug)) {
            setlikeCount((prev) => {
              if (prev === 0) return prev;
              return prev - 1;
            });
          } else {
            setlikeCount((prev) => prev + 1);
            if (myUserProfile?.dislikedQuestions?.includes(slug)) {
              setdisLikeCount((prev) => {
                if (prev === 0) return prev;
                return prev - 1;
              });
            }
          }
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
            setNotificationPopMsgNature((prev) => false);
            setnotificationPopMsg((prev) => "wait...");
            return;
          }
          if (!userAuthStatus) {
            setNotificationPopMsgNature((prev) => false);
            setnotificationPopMsg((prev) => "Please Login");
            return;
          }

          like_dislike_BookMark("Dislike");
          setLike_Dislike((prev) => "disliked");
          if (myUserProfile?.dislikedQuestions?.includes(slug)) {
            setdisLikeCount((prev) => {
              if (prev === 0) return prev;
              return prev - 1;
            });
          } else {
            setdisLikeCount((prev) => prev + 1);

            if (myUserProfile?.likedQuestions?.includes(slug)) {
              setlikeCount((prev) => {
                if (prev === 0) return prev;
                return prev - 1;
              });
            }
          }
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
            setNotificationPopMsgNature(false);
            setnotificationPopMsg("wait...");
            return;
          }

          if (!userAuthStatus) {
            setNotificationPopMsgNature(false);
            setnotificationPopMsg("Please Login");
            return;
          }
          like_dislike_BookMark("BooKMark");
          setIsBookMarked((prev) => !prev);
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