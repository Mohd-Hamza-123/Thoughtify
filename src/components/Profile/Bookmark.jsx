import React, { useRef, useState, useEffect } from "react";
import "./Favourite.css";
import appwriteService from "../../appwrite/config";
import { Spinner } from "..";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import profile from "../../appwrite/profile";

const Bookmark = ({ visitedProfileUserID }) => {
  const bookMarkPostInRedux = useSelector((state) => state.profileSlice?.filteredBookmarkPosts)
  const dispatch = useDispatch();

  const spinnerRef = useRef();
 
  const userData = useSelector((state) => state.auth.userData);

  const bookMarkCounter = useRef(0);

  const submit = async () => {
    if (visitedProfileUserID === userData?.$id) {
      const totalLength = myUserProfile?.bookmarks?.length;
      let bookMarkArray = myUserProfile?.bookmarks;

      if (totalLength === 0) {
        setisPostAvailable(false);
        return;
      } else {
        setisPostAvailable(true);
      }

      if (totalLength > 5) {
        for (let i = 0; i < 5; i++) {
          const filteredBookmark = await appwriteService.getPostWithBookmark(
            bookMarkArray[i]
          );
          console.log(filteredBookmark);
          if (filteredBookmark) {
            dispatch(
              getFilteredBookmarkPosts({
                filteredBookmarkPosts: [filteredBookmark],
              })
            );
          }
        }
        bookMarkCounter.current = bookMarkCounter.current + 5;
      } else {
        for (let i = 0; i < totalLength; i++) {
          const filteredBookmark = await appwriteService.getPostWithBookmark(
            bookMarkArray[i]
          );

          if (filteredBookmark) {
            dispatch(
              getFilteredBookmarkPosts({
                filteredBookmarkPosts: [filteredBookmark],
              })
            );
          } else {
            // console.log(myUserProfile?.bookmarks);
            let newArr = myUserProfile?.bookmarks
            newArr.splice(i, 1);
            const updateBookMarkInProfile = await profile.updateProfileWithQueries({ profileID: myUserProfile?.$id, bookmarks: newArr })
            console.log(updateBookMarkInProfile)
            setMyUserProfile((prev) => updateBookMarkInProfile)
          }
        }
      }
    }
  };


  useEffect(() => {
    const ref = spinnerRef.current;
    if (ref) {
      const observer = new IntersectionObserver(
        ([entry]) => {
         
        },
        {
          root: null,
          rootMargin: "0px",
          threshold: 1,
        }
      );

      observer.observe(ref);
      return () => ref && observer.unobserve(ref);
    }
  }, []);




  return (
    <div
      id="Profile_Bookmark_Filter"
      className={`flex`}
    >
      <div id="Profile_Bookmark_Filtered_Bookmark">

        {bookMarkPostInRedux?.map((bookmark, index) => {

          if (isPostAvailable !== true || (visitedProfileUserID !== userData?.$id) || !bookmark) {
            return;
          }

          return (
            < div className={`BookMark_Posts`
            } key={bookmark?.$id}>
              <Link to={`/post/${bookmark?.$id}/${null}`}>
                <p>{bookmark?.title}</p>
                <div
                  className="BrowseBookmark_created_category_views flex gap-3 flex-wrap"
                >
                  <span className="Favourite_CreatedAt">
                    {new Date(bookmark?.$createdAt).toLocaleDateString(
                      "en-US",
                      { day: "numeric", month: "long", year: "numeric" }
                    )}
                  </span>
                  <span className="Favourite_Category">{bookmark?.category}</span>
                  <div className="flex justify-center items-center">
                    <span>{bookmark?.views}</span>
                    <i className=" fa-solid fa-eye" aria-hidden="true"></i>
                  </div>
                  <div>
                    <span>{bookmark.commentCount}</span>
                    <i className="fa-solid fa-comment"></i>
                  </div>
                  <div>
                    <span>{bookmark?.like}</span>
                    <i className="fa-solid fa-thumbs-up"></i>
                  </div>

                  <div>
                    <span>{bookmark?.dislike}</span>
                    <i className="fa-solid fa-thumbs-down"></i>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}

      </div>

      {
        (true) && (
          <section ref={spinnerRef} className="flex justify-center">
            <Spinner />
          </section>
        )
      }
    </div >
  );
};

export default Bookmark;
