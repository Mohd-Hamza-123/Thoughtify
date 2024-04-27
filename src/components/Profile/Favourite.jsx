import React, { useRef, useState, useEffect } from "react";
import "./Favourite.css";
import appwriteService from "../../appwrite/config";
import { Spinner } from "../";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAskContext } from "../../context/AskContext";
import { getFilteredBookmarkPosts } from "../../store/profileSlice";


const Favourite = ({ visitedProfileUserID }) => {
  const bookMarkPostInRedux = useSelector(
    (state) => state.profileSlice?.filteredBookmarkPosts
  );
  const dispatch = useDispatch();
  // console.log(bookMarkPostInRedux)
  const spinnerRef = useRef();
  const [isLoading, setIsLoading] = useState(false);

  const [isPostAvailable, setisPostAvailable] = useState(true);
  const [totalFilteredbookmarks, settotalFilteredbookmarks] = useState(0);

  const [isIntersecting, setIsIntersecting] = useState(false);

  const {
    hasMorePostsInProfileFilterBookmark,
    sethasMorePostsInProfileFilterBookmark,
    myUserProfile,
  } = useAskContext();
  // console.log(myUserProfile);
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
          // console.log(bookMarkCounter.current)
          const filteredBookmark = await appwriteService.getPostWithBookmark(
            bookMarkArray[i]
          );
          // console.log("HI")
          dispatch(
            getFilteredBookmarkPosts({
              filteredBookmarkPosts: [filteredBookmark],
            })
          );
        }
        bookMarkCounter.current = bookMarkCounter.current + 5;
      } else {
        for (let i = 0; i < totalLength; i++) {
          const filteredBookmark = await appwriteService.getPostWithBookmark(
            bookMarkArray[i]
          );
          console.log(filteredBookmark);
          dispatch(
            getFilteredBookmarkPosts({
              filteredBookmarkPosts: [filteredBookmark],
            })
          );
        }
      }
      setIsLoading(true);
      sethasMorePostsInProfileFilterBookmark(true);
    }
  };

  useEffect(() => {
    if (bookMarkPostInRedux.length >= totalFilteredbookmarks) {
      setIsLoading(false);
      sethasMorePostsInProfileFilterBookmark(false);
    } else {
      setIsLoading(true);
      sethasMorePostsInProfileFilterBookmark(true);
    }
  }, [bookMarkPostInRedux]);

  useEffect(() => {
    const getFilteredBookmark = async () => {
      for (
        let i = bookMarkPostInRedux.length - 1;
        i < totalFilteredbookmarks && i < bookMarkPostInRedux.length - 1 + 5;
        i++
      ) {
        console.log("lkjfaslkjdf");
        const filteredBookmark = await appwriteService.getPostWithBookmark(
          myUserProfile.bookmarks[i]
        );

        dispatch(
          getFilteredBookmarkPosts({
            filteredBookmarkPosts: [filteredBookmark],
          })
        );
        if (i == totalFilteredbookmarks - 1) {
          setIsLoading(false);
          sethasMorePostsInProfileFilterBookmark(false);
        }
      }
      bookMarkCounter.current = bookMarkCounter.current + 5;
    };

    if (isIntersecting && bookMarkPostInRedux.length >= 5) {
      getFilteredBookmark();
    }
  }, [isIntersecting]);

  // console.log(bookMarkPostInRedux.length);

  useEffect(() => {
    const ref = spinnerRef.current;
    if (ref) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsIntersecting((prev) => entry.isIntersecting);
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
  }, [spinnerRef.current, isLoading, bookMarkPostInRedux]);
  // getting total posts

  useEffect(() => {
    if (myUserProfile) {
      if (myUserProfile?.userIdAuth !== visitedProfileUserID) {
        setIsLoading((prev) => false)
      }
      settotalFilteredbookmarks(myUserProfile?.bookmarks?.length);
    }
  }, [myUserProfile]);

  const indicator = useRef(true);

  useEffect(() => {
    if (indicator.current && bookMarkPostInRedux.length < 4) {
      submit();
      indicator.current = false;
    }

    if (bookMarkPostInRedux.length < myUserProfile.bookmarks.length) {
      setIsLoading(true);
      sethasMorePostsInProfileFilterBookmark(true)
    }
  }, []);


  return (
    <div
      id="Profile_Bookmark_Filter"
      className={`flex`}
    >
      <div id="Profile_Bookmark_Filtered_Bookmark">
        {!isPostAvailable && <p className="text-center">{`No Posts Available`}</p>}
        {visitedProfileUserID !== userData?.$id && <p className="text-center">{`You can't see Bookmark posts of Others`}</p>}
        {bookMarkPostInRedux?.map((bookmark, index) => {
          if (isPostAvailable !== true) {
            return;
          }
          return (
            <div className={`BookMark_Posts`} key={bookmark?.$id}>
              <Link to={`/post/${bookmark?.$id}/${null}`}>
                <p>{bookmark?.title}</p>
                <div
                  className="BrowseBookmark_created_category_views flex gap-3"
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

      {(isLoading && hasMorePostsInProfileFilterBookmark && myUserProfile?.userIdAuth === visitedProfileUserID && userData) && (
        <section ref={spinnerRef} className="flex justify-center">
          <Spinner />
        </section>
      )}
    </div>
  );
};

export default Favourite;
