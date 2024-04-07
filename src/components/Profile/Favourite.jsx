import React, { useRef, useState, useEffect } from "react";
import "./Favourite.css";
import appwriteService from "../../appwrite/config";
import { Input, Button, Spinner } from "../";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { categoriesArr } from "../AskQue/Category";
import { useAskContext } from "../../context/AskContext";
import { getFilteredBookmarkPosts } from "../../store/profileSlice";
import profile from "../../appwrite/profile";

const Favourite = ({ visitedProfileUserID }) => {
  const bookMarkPostInRedux = useSelector(
    (state) => state.profileSlice?.filteredBookmarkPosts
  );
  const dispatch = useDispatch();
  // console.log(bookMarkPostInRedux)
  const spinnerRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  // console.log(isLoading)

  const [isPostAvailable, setisPostAvailable] = useState(true);
  const [totalFilteredbookmarks, settotalFilteredbookmarks] = useState(0);
  // console.log(totalFilteredbookmarks)
  const [isIntersecting, setIsIntersecting] = useState(false);
  // console.log(isIntersecting)
  const {
    hasMorePostsInProfileFilterBookmark,
    sethasMorePostsInProfileFilterBookmark,
    myUserProfile,
  } = useAskContext();
  const userData = useSelector((state) => state.auth.userData);
  const { register, handleSubmit, setValue, reset, getValues } = useForm({});
  const bookMarkCounter = useRef(0);

  // console.log(isLoading)
  // console.log(hasMorePostsInProfileFilterBookmark)

  const submit = async () => {
    if (visitedProfileUserID === userData.$id) {
      const totalLength = myUserProfile.bookmarks.length;
      let bookMarkArray = myUserProfile.bookmarks;

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
      settotalFilteredbookmarks(myUserProfile.bookmarks.length);
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
      {/* <form
        id="Profile_Filter_Bookmark_Form"
        className="w-full flex flex-col gap-5 p-3 relative"
        onSubmit={handleSubmit(submit)}
      >
        <div id="Profile_Bookmark_Title">
          <p>Filter by Post Title :</p>
          <div className="flex gap-2">
            <label htmlFor="Profile_Bookmark_Title_Filter">Title : </label>
            <Input
              {...register("Title", {
                required: false,
              })}
              id="Profile_Bookmark_Title_Filter"
              placeholder="Title"
            />
          </div>
        </div>

        <div>
          <p>Filter By Views :</p>
          <div className="flex flex-col gap-1">
            <div className="flex gap-2">
              <input
                {...register("Viewed")}
                type="radio"
                name="Viewed"
                id="Profile_Bookmark_Most_Viewed"
                value={"MostViewed"}
              />
              <label htmlFor="Profile_Bookmark_Most_Viewed">Most Viewed</label>
            </div>
            <div className="flex gap-2">
              <input
                {...register("Viewed")}
                type="radio"
                name="Viewed"
                id="Profile_Bookmark_Less_Viewed"
                value={"lessViewed"}
              />
              <label htmlFor="Profile_Bookmark_Less_Viewed">Less Viewed</label>
            </div>
          </div>
        </div>

        <div>
          <p>Filter By Post Age :</p>
          <div className="flex flex-col gap-1">
            <div className="flex gap-2">
              <input
                {...register("PostAge")}
                id="Profile_Bookmark_PostAge_Recent"
                type="radio"
                name="PostAge"
                value={"Recent"}
              />
              <label
                className="cursor-pointer"
                htmlFor="Profile_Bookmark_PostAge_Recent"
              >
                Recent
              </label>
            </div>
            <div className="flex gap-2">
              <input
                {...register("PostAge")}
                id="Profile_Bookmark_PostAge_Oldest"
                type="radio"
                name="PostAge"
                value={"Oldest"}
              />
              <label
                className="cursor-pointer"
                htmlFor="Profile_Bookmark_PostAge_Oldest"
              >
                Oldest
              </label>
            </div>
          </div>
        </div>

        <div>
          <p>Filter By Comment :</p>
          <div className="flex flex-col gap-1">
            <div className="flex gap-2">
              <input
                {...register("Commented")}
                id="Profile_Bookmark_Most_Commented"
                type="radio"
                name="Commented"
                value={"Most Commented"}
              />
              <label
                className="cursor-pointer"
                htmlFor="Profile_Bookmark_Most_Commented"
              >
                Most Commented
              </label>
            </div>
            <div className="flex gap-2">
              <input
                {...register("Commented")}
                id="Profile_Bookmark_Least_Commented"
                type="radio"
                name="Commented"
                value={"Least Commented"}
              />
              <label
                className="cursor-pointer"
                htmlFor="Profile_Bookmark_Least_Commented"
              >
                Least Commented
              </label>
            </div>
          </div>
        </div>

        <div>
          <div>
            <p>Favourite : </p>
          </div>
          <div className="flex gap-2">
            <input
              type="radio"
              {...register("Like_Dislike")}
              name="Like_Dislike"
              id="Profile_Bookmark_Liked"
              value={"Most Liked"}
            />
            <label htmlFor="Profile_Bookmark_Liked">Most liked</label>
          </div>
          <div className="flex gap-2">
            <input
              type="radio"
              {...register("Like_Dislike")}
              name="Like_Dislike"
              id="Profile_Bookmark_Disliked"
              value={"Most Disliked"}
            />
            <label htmlFor="Profile_Bookmark_Disliked">Most disliked</label>
          </div>
        </div>

        <div>
          <p>Filter By Category : </p>
          <div id="Profile_Bookmark_Category" className="flex gap-2">
            <label htmlFor="">Category : </label>
            <select
              name="category"
              {...register("category")}
              id=""
              className="outline-none"
            >
              <option defaultChecked value={"All Category"}>
                All Category
              </option>
              {categoriesArr?.map((category, index) => (
                <option key={category.category + index}>
                  {category.category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div id="Profile_Bookmark_FilterByDate">
          <p>Filter By Date : </p>
          <div className="flex flex-col gap-3">
            <div className="flex gap-1">
              <label className="" htmlFor="AfterDate">
                After Date :
              </label>
              <input
                {...register("AfterDate", {
                  required: false,
                })}
                type="date"
                name="AfterDate"
                id="AfterDate"
              />
            </div>

            <div className="flex gap-1">
              <label className="" htmlFor="BeforeDate">
                Before Date :
              </label>
              <input
                type="date"
                name="BeforeDate"
                id="BeforeDate"
                {...register("BeforeDate")}
              />
            </div>
          </div>
        </div>

        <Button type="Submit" className="Profile_Bookmark_ApplyFilter">
          Apply Filter
        </Button>
        <input
          type="reset"
          onClick={() => {
            reset();
            sethasMorePostsInProfileFilterBookmark(false);
          }}
          value={"Reset Filter"}
          className="Profile_Bookmark_ResentFilter"
        />
      </form> */}

      <div id="Profile_Bookmark_Filtered_Bookmark">
        {!isPostAvailable && <p className="text-center">{`No Posts Available`}</p>}
        {visitedProfileUserID !== userData?.$id && <p className="text-center">{`You can't see Bookmark posts of Others`}</p>}
        {bookMarkPostInRedux?.map((bookmark, index) => {
          if (isPostAvailable !== true) {
            return;
          }
          return (
            <div key={bookmark?.$id}>
              <Link to={`/post/${bookmark?.$id}/${null}`}>
                <p>{bookmark?.title}</p>
                <div
                  id="BrowseBookmark_created_category_views"
                  className="flex gap-3"
                >
                  <span>
                    {new Date(bookmark?.$createdAt).toLocaleDateString(
                      "en-US",
                      { day: "numeric", month: "long", year: "numeric" }
                    )}
                  </span>
                  <span>{bookmark?.category}</span>
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

        {isLoading && hasMorePostsInProfileFilterBookmark && (
          <section ref={spinnerRef} className="flex justify-center">
            <Spinner />
          </section>
        )}
      </div>
    </div>
  );
};

export default Favourite;
