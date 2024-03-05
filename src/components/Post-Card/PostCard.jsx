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
  $createdAt
}) => {
  // console.log(new Date($createdAt))
  const userProfile = useSelector((state) => state.profileSlice.userProfile)
  const [profileImgURL, setprofileImgURL] = useState('')
  const [booleanGender, setbooleanGender] = useState(true);
  const [thumbnailURL, setthumbnailURL] = useState('')
  const [totalMaleComments, setTotalMaleComments] = useState(0)
  const [totalFemaleComments, setTotalFemaleComments] = useState(0)


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



  const getAllComments = async () => {
    const arr = [
      Query.equal("postid", [`${$id}`])
    ]
    let boy = 0;
    let girls = 0;
    const comments = await realTime.customCommentFilter(arr)
    if (comments) {
      comments.documents.forEach((comment) => {
        if (comment.gender === 'female') girls++
        else boy++
      })
      setTotalFemaleComments(girls)
      setTotalMaleComments(boy)
      // console.log("hi")
    }

  }




  useEffect(() => {
    getAllComments()
  }, [])

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
              <span>2</span>
              <i className=" fa-solid fa-eye"></i>
            </span>
          </div>
          <div id="PostCard_Comments_Icon" className="flex gap-2">
            <i className="bx bx-message-rounded">
              <p>{totalMaleComments}</p>
            </i>

            <i className="bx bx-message-rounded">
              <p>{totalFemaleComments}</p>
            </i>
          </div>
        </div>
      </div>


    </>
  );
};

export default PostCard;
