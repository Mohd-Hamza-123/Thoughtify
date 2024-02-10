import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./PostCard.css";
import profile from "../../appwrite/profile";
import appwriteService from "../../appwrite/config";

const PostCard = ({
  $id,
  title = "Title",
  queImage,
  name = "Name",
  userId,
  category,
  queImageID,
}) => {
  // console.log(userId)
  const [profileImgURL, setprofileImgURL] = useState('')
  const [booleanGender, setbooleanGender] = useState(true);
  const [thumbnailURL, setthumbnailURL] = useState('')
  const getPostData = async () => {
    appwriteService.getThumbnailPreview(queImageID)
      .then((res) => {
        setthumbnailURL(res.href)
      })

    profile.listProfile({ slug: userId })
      .then((res) => res.documents[0].profileImgID)
      .then((ID) => {
        profile.getStoragePreview(ID)
          .then((res) => setprofileImgURL(res.href))
          .catch((err) => console.log(err))
      })
  }


  useEffect(() => {
    setbooleanGender(userId.includes("_-.male"));
    getPostData()
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
    <div id="PostCard" className="flex w-full">
      <div id="PostCard_left" className="border-2 border-red">
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
                className={`${booleanGender ? "text-blue-900" : "text-pink-600"
                  }`}
              >
                {name}
              </h4>
            </Link>
          </div>
          <Link to={`/post/${$id}`}>
            <h3 id="PostCard_title">{countTitle(title)}</h3>
          </Link>
        </div>
        <span className="my-1">
          <small>{category}</small>
        </span>
        <div id="PostCard_Comments_Icon" className="flex gap-2">
          <i className="bx bx-message-rounded">
            <small>{`20`}</small>
          </i>

          <i className="bx bx-message-rounded">
            <small>{`20`}</small>
          </i>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
