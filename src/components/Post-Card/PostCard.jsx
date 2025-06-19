import "./PostCard.css";
import React, { memo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useGetProfileData } from "@/lib/profile";
import { useAskContext } from "../../context/AskContext";
import { FaComment } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";

const PostCard = ({
  $id,
  title = "Title",
  queImage,
  name = "Name",
  userId,
  category,
  queImageID,
  profileImgID,
  $createdAt,
  views,
  commentCount,
  pollQuestion,
  opinionsFrom,
  trustedResponderPost
}) => {

  const { isDarkModeOn } = useAskContext()

  const { getProfileImageURLFromID } = useGetProfileData()

  const { data: profileImgURL, isPending, isError } = useQuery({
    queryKey: ["profileImages", profileImgID],
    queryFn: async () => await getProfileImageURLFromID(profileImgID),
    staleTime: Infinity,
  });

  return (
    <div className={`PostCard ${isDarkModeOn ? 'darkMode' : ''}`}>
      <div id="PostCard_left" className="" >
        <Link to={`/post/${$id}/${null}`}>
          <img
            id="Post-Card-img"
            src={`${queImage}`}
            alt="Image"
            className="w-full"
          />
        </Link>
      </div>

      <div
        id="PostCard_right"
        className="flex flex-col w-full justify-left align-center mb-4 px-3 pt-2"
      >
        <div>
          <div className="flex gap-2">
            <Link to={`/profile/${userId}`}>
              <div className="rounded-full">
                <img
                  src={`${profileImgURL}`}
                  id="PostCard-profile-pic"
                  className="rounded-full"
                />
              </div>
            </Link>
            <Link to={`/profile/${userId}`}>
              <h4 id="PostCard-profile-name" className={`${isDarkModeOn ? "text-white" : 'text-black'}`}>
                {name}
              </h4>
            </Link>
            {trustedResponderPost && <div>
              <span className="PostCard_category">{'Responder'}</span>
            </div>}
          </div>
          <Link to={`/post/${$id}/${null}`}>
            <h3 id="PostCard_title">{title ? title : pollQuestion}</h3>
          </Link>
        </div>
        <div className="PostCard_Details flex gap-4 items-center my-1">
          <span className="PostCard_Date">{new Date($createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          <span className="PostCard_category">{category}</span>
          <span className="PostCard_category">{opinionsFrom}</span>
          <span className="PostCard_Views flex gap-2 items-center">
            <span>{views}</span>
            <IoEyeSharp />
          </span>
        </div>
        <div id="PostCard_Comments_Icon" className="flex gap-2  items-center">
          <p id='PostCard_MaleComments_p' className={`${isDarkModeOn ? "text-white" : 'text-black'}`} >{commentCount}</p>
          <FaComment />
        </div>
      </div>
    </div>
  );
};

export default memo(PostCard);
