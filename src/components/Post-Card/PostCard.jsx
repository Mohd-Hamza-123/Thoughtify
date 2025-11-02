import "./PostCard.css";
import React, { memo } from "react";
import { Link } from "react-router-dom";
import { FaComment } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
import { increaseViews } from "@/lib/posts";
import UnderlineAnimate from "../UnderlineAnimate";
import { Icons, SkeletonImage } from "..";
import { getAvatar } from "@/lib/avatar";

const PostCard = ({
  $id,
  name,
  views,
  title,
  userId,
  category,
  verified,
  queImage,
  $createdAt,
  pollQuestion,
  opinionsFrom,
  commentCount,
  profileImage = "",
  isTrustedResponder,
  trustedResponderPost,
}) => {

  profileImage = profileImage ? profileImage.replace("/preview", "/view") : null;
  const { imageURL, imageID } = JSON.parse(queImage || "{}");
  const imageView = imageURL ? imageURL.replace("/preview", "/view") : imageURL;
  const date = new Date($createdAt).toDateString();
 
  return (
    <section
      onClick={() => increaseViews($id)}
      className="group relative w-full mt-4 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer">

      <div className="flex flex-col lg:flex-row">
        {/* PostCard Image  */}
        <figure className="order-1 lg:order-2 w-full lg:w-1/3 h-[220px] sm:h-[260px] lg:h-auto relative overflow-hidden">
          <Link to={`/post/${$id}/${null}`} className="absolute inset-0">
            <SkeletonImage src={imageView} alt={title} className="w-full h-full object-cover transform transition-transform duration-400 group-hover:scale-105" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/28 via-transparent to-transparent" />
          </Link>
        </figure>

        {/* PostCard Content */}
        <div className="order-2 lg:order-1 w-full lg:w-2/3 p-4 sm:p-6 md:p-6 lg:p-6 flex flex-col justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link to={`/profile/${userId}`} className="flex items-center gap-3">
              <img
                src={profileImage ? profileImage : getAvatar(name)}
                id="PostCard-profile-pic"
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover ring-2 ring-white dark:ring-slate-900 shadow-sm"
                alt={name}
              />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1">
                  <span>{name}</span>
                  {verified && <Icons.verified />}
                </span>

                {trustedResponderPost && <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 mt-1">
                  Responder
                </span>}

              </div>
            </Link>
          </div>

          <Link to={`/post/${$id}/${null}`}>
            <h2 className="poppins text-lg sm:text-xl md:text-2xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight inline-block">
              <UnderlineAnimate className="bg-gray-700">
                {title ? title : pollQuestion}
              </UnderlineAnimate>
            </h2>
          </Link>

          <div className="flex flex-wrap gap-2 sm:gap-3 items-center mt-2">
            <span className="tag-style text-sm">
              {date}
            </span>

            <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 text-xs border border-indigo-100 dark:border-indigo-800">
              {category}
            </span>

            {opinionsFrom && (
              <span className="tag-style text-sm">
                {opinionsFrom}
              </span>
            )}

            <span className="tag-style text-sm flex items-center gap-1">
              <span className="text-sm font-semibold">{views}</span>
              <IoEyeSharp className="text-sm" />
            </span>

            <span className="tag-style text-sm flex items-center gap-1">
              <span className="text-sm font-semibold">{commentCount}</span>
              <FaComment className="text-sm" />
            </span>

            <span className="tag-style text-md flex items-center gap-1">
              {opinionsFrom === 'Everyone' ? <Icons.public /> : <Icons.private />}
            </span>
          </div>


        </div>
      </div>
    </section>
  );
};

export default memo(PostCard);
