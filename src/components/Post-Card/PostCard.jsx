import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./PostCard.css";
import profile from "../../appwrite/profile";
import appwriteService from "../../appwrite/config";
import realTime from "../../appwrite/realTime";
import { useSelector } from 'react-redux'
import { Query } from 'appwrite'
const PostCard = ({
  $id,
  title = "Title",
  queImage,
  name = "Name",
  userId,
  category,
  queImageID,
  $createdAt,
  views,
  commentCount
}) => {

  const userProfile = useSelector((state) => state.profileSlice.userProfile)
  const [profileImgURL, setprofileImgURL] = useState('')
  const [booleanGender, setbooleanGender] = useState(true);
  const [thumbnailURL, setthumbnailURL] = useState('')
  const [totalComments, settotalComments] = useState(0)


  const getPostData = async () => {
    appwriteService.getThumbnailPreview(queImageID)
      .then((res) => {
        setthumbnailURL(res.href)
      })
  }

  const profileData = async () => {
    profile.listProfile({ slug: userId })
      .then((res) => {
        // console.log(res)
        if (res?.documents[0].$id) {
          return res?.documents[0].profileImgID
        }
      })
      .then((ID) => {
        profile.getStoragePreview(ID)
          .then((res) => setprofileImgURL(res.href))
          .catch((err) => console.log(err))
      })
  }



  // useEffect(() => {
  //   const getAllComments = async () => {
  //     appwriteService
  //       .getPost($id)
  //       .then((res) => {
  //         settotalComments((prev) => res.commentCount)
  //       })
  //       .catch((err) => settotalComments(0))
  //   }
  //   getAllComments()
  // }, [])

  useEffect(() => {
    if (userId) {
      profileData()
    }

  }, [userProfile])

  useEffect(() => {
    setbooleanGender(userId.includes("_-.male"));
    if (queImageID) {
      getPostData()
    }

  }, [queImageID, category]);

  function countTitle(title) {
    let str = `${title}`;
    str = str.trim();
    const words = str.split(/\s+/).filter((word) => word !== "");
    const numberOfWords = words.length;

    if (numberOfWords < 30) {
      return title;
    } else {
      const words = str.split(/\s+/).filter((word) => word !== "");
      const limitedWordsArray = words.slice(0, 30);
      const limitedWordsString = limitedWordsArray.join(" ");
      return `${limitedWordsString} ...`;
    }
  }
  return (
    <>
      <div id="PostCard" className="flex flex-row-reverse w-full">
        <div id="PostCard_left" className="">
          <Link to={`/post/${$id}`}>
            {thumbnailURL ? (
              <img
                id="Post-Card-img"
                src={`${thumbnailURL ? thumbnailURL : queImage}`}
                alt="Image"
                className="w-full"
              />
            ) : (
              <img
                id="Post-Card-img"
                src={`https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg`}
                alt="Image"
                className="w-full"
              />
            )}
          </Link>
        </div>

        <div
          id="PostCard_right"
          className="flex flex-col w-full justify-left align-center mb-4 px-3 pt-2"
        >
          <div>
            <div className="flex gap-2">
              <Link to={`profile/${userId}`}>
                <div className="rounded-full">
                  <img
                    src={`${profileImgURL}`}
                    id="PostCard-profile-pic"
                    className="rounded-full"
                    alt=""
                  />
                </div>
              </Link>
              <Link to={`profile/${userId}`}>
                <h4
                  id="PostCard-profile-name"
                // className={`${booleanGender ? "text-blue-900" : "text-pink-600"
                //   }`}
                >
                  {name}
                </h4>
              </Link>
            </div>
            <Link to={`/post/${$id}`}>
              <h3 id="PostCard_title">{countTitle(title)}</h3>
            </Link>
          </div>
          <div className="flex gap-4 items-center my-1">
            <span className="PostCard_Date">{new Date($createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <span className="PostCard_category">{category}</span>
            <span className="PostCard_Views flex gap-2 items-center">
              <span>{views}</span>
              <i className=" fa-solid fa-eye"></i>
            </span>
          </div>
          <div id="PostCard_Comments_Icon" className="flex gap-2  items-center">

            <p id='PostCard_MaleComments_p' >{commentCount}</p>
            <svg id='PostCard_MaleComments' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M512 240c0 114.9-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6C73.6 471.1 44.7 480 16 480c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4l0 0 0 0 0 0 0 0 .3-.3c.3-.3 .7-.7 1.3-1.4c1.1-1.2 2.8-3.1 4.9-5.7c4.1-5 9.6-12.4 15.2-21.6c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208z" /></svg>

            {/* <p id='PostCard_FemaleComments_p'>{totalFemaleComments}</p>
            <svg id='PostCard_FemaleComments' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M512 240c0 114.9-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6C73.6 471.1 44.7 480 16 480c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4l0 0 0 0 0 0 0 0 .3-.3c.3-.3 .7-.7 1.3-1.4c1.1-1.2 2.8-3.1 4.9-5.7c4.1-5 9.6-12.4 15.2-21.6c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208z" /></svg> */}
          </div>
        </div>
      </div>


    </>
  );
};

export default PostCard;
