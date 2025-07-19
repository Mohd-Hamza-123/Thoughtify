import "./PostCard.css";
import React, { memo } from "react";
import { Link } from "react-router-dom";
import { FaComment } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
import increaseViews from "@/services/increasePostView";


const PostCard = ({
  $id,
  title = "Title",
  queImage,
  name = "Name",
  userId,
  category,
  $createdAt,
  views,
  commentCount,
  pollQuestion,
  opinionsFrom,
  trustedResponderPost,
  isTrustedResponder
}) => {
  console.log(queImage)
  const { imageURL, imageID } = JSON.parse(queImage)
  const imageView = imageURL ? imageURL.replace("/preview", "/view") : imageURL

  return (
    <section
      onClick={() => increaseViews($id)}
      className="PostCard flex flex-col-reverse h-[350px] lg:h-[200px] lg:flex-row p-2 w-full mt-3">

      <div className="h-[45%] p-0 md:p-2 lg:h-full flex flex-col justify-between lg:w-[70%] lg:py-3">
        <div className="flex gap-2 items-center">
          <Link to={`/profile/${userId}`}>
            <img
              src={`${'NoProfile.png'}`}
              id="PostCard-profile-pic"
              className="rounded-full" />
          </Link>
          <Link to={`/profile/${userId}`}>{name}</Link>
          {trustedResponderPost && <span className="tag-style text-xs">Responder</span>}
        </div>
        <Link to={`/post/${$id}/${null}`}>
          <h3 className="poppins text-lg font-bold">{title ? title : pollQuestion}</h3>
        </Link>
        <div className="PostCard_Details flex gap-4 items-center my-1 flex-wrap">
          <span className="text-xs hidden md:block tag-style">{new Date($createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          <span className="tag-style text-xs">{category}</span>
          <span className="tag-style text-xs">{opinionsFrom}</span>
          <span className="flex gap-2 items-center tag-style text-xs">
            <span>{views}</span>
            <IoEyeSharp />
          </span>
          <span className="flex gap-2 items-center tag-style text-xs">
            <span>{commentCount}</span>
            <FaComment />
          </span>
        </div>
      </div>

      <figure className="h-1/2 lg:h-full lg:w-[30%]">
        <Link to={`/post/${$id}/${null}`}>
          <img
            src={`${imageView}`}
            alt="Image"
            className="w-full rounded-sm object-cover h-full"
          />
        </Link>
      </figure>

    </section>
  );
};

export default memo(PostCard);

