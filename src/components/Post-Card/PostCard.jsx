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
    <section className="PostCard flex flex-col-reverse h-[350px] lg:h-[200px] lg:flex-row p-2 w-full">

      <div className="h-[45%] p-2 lg:h-full flex flex-col justify-between lg:w-[70%] lg:py-3">
        <div className="flex gap-2">
          <Link to={`/profile/${userId}`}>
            <div className="rounded-full">
              <img
                src={`${profileImgURL || 'NoProfile.png'}`}
                id="PostCard-profile-pic"
                className="rounded-full"
              />
            </div>
          </Link>
          <Link to={`/profile/${userId}`}>
            <h4 id="PostCard-profile-name">
              {name}
            </h4>
          </Link>
          {trustedResponderPost && <span className="tag-style">Responder</span>}
        </div>
        <Link to={`/post/${$id}/${null}`}>
          <h3 className="poppins text-lg font-bold">{title ? title : pollQuestion}</h3>
        </Link>
        <div className="PostCard_Details flex gap-4 items-center my-1">
          <span className="PostCard_Date hidden md:block tag-style">{new Date($createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          <span className="tag-style">{category}</span>
          <span className="tag-style">{opinionsFrom}</span>
          <span className="flex gap-2 items-center tag-style">
            <span>{views}</span>
            <IoEyeSharp />
          </span>
          <span className="flex gap-2 items-center tag-style">
            <span>{commentCount}</span>
            <FaComment />
          </span>
        </div>
      </div>

      <figure className="h-1/2 lg:h-full lg:w-[30%]">
        <Link to={`/post/${$id}/${null}`}>
          <img
            src={`${queImage}`}
            alt="Image"
            className="w-full rounded-sm object-cover h-full"
          />
        </Link>
      </figure>

    </section>
  );
};

export default memo(PostCard);
