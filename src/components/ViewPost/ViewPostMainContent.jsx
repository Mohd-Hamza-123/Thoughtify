import Prism from "../Prism";
import React, { useRef } from "react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaComment } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
import { dateFormatFunc } from "@/helpers/format-dates";
import conf from "@/conf/conf";
import { useQuery } from "@tanstack/react-query";
import { useGetProfileData } from "@/lib/profile";
import parse from "html-react-parser"

const ViewPostMainContent = ({ post }) => {
  // console.log(post);

  const ellipsis_Vertical = useRef();
  const ViewPost_ellipsis_Vertical = useRef();

  const userData = useSelector((state) => state?.auth?.userData);
  console.log(userData);
  const isAuthor = post && userData ? post.userId === userData.$id : false;

  const { getProfileImageURLFromID } = useGetProfileData();

  const { data: profileImgURL, isPending, isError } = useQuery({
    queryKey: ["profileImages", post?.profileImgID],
    queryFn: async () => await getProfileImageURLFromID(profileImgID),
    staleTime: Infinity,
  });

  // console.log(profileImgURL)

  return (
    <section className="p-2 shadow-lg">
      <div className="flex justify-between mx-3 mt-1 relative items-center">

        {/* Below div contains category, date, views, comment count */}
        <div className="flex gap-3">
          <span className="tag-style">{post?.category}</span>
          <span className="tag-style">{dateFormatFunc(post?.date) || ""}</span>
          <span className="flex gap-1 items-center tag-style">
            <span>{post?.views}</span>
            <IoEyeSharp />
          </span>
          <span className="flex gap-2 items-center tag-style">
            <span>{post?.commentCount}</span>
            <FaComment />
          </span>
        </div>

        <div
          className="hidden"
          onMouseOver={() => {
            ellipsis_Vertical.current.classList.add("fa-flip");
          }}
          onMouseOut={() => {
            ellipsis_Vertical.current.classList.remove("fa-flip");
          }}
          onClick={() => {
            ViewPost_ellipsis_Vertical.current.classList.toggle("block");
          }}
        >
          {(isAuthor || userData?.$id === conf?.myPrivateUserID) && (
            <div className="relative">
              <div>
                <div ref={ViewPost_ellipsis_Vertical}>
                  <ul>
                    {(isAuthor || userData?.$id === conf?.myPrivateUserID) && (
                      <li
                        onClick={() => {
                          navigate(`/EditQuestion/${post?.$id}`);
                        }}
                      >
                        <Button>
                          <i className="fa-regular fa-pen-to-square"></i>
                        </Button>
                      </li>
                    )}
                    {(isAuthor || userData?.$id === conf?.myPrivateUserID) && (
                      <li>
                        <Button
                          onClick={() => {
                            deletePost();
                            deleteThumbnail();
                            deletePostComments();
                          }}
                        >
                          <i className="fa-solid fa-trash"></i>
                        </Button>
                      </li>
                    )}
                  </ul>
                </div>
                <Button>
                  <i
                    id="ViewPost_fa-ellipsis"
                    ref={ellipsis_Vertical}
                    className="fa-solid fa-ellipsis-vertical text-xl"
                  ></i>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>


      <div className="mt-3">

        <Link to={`/profile/${post?.userId}`}>
          <div className="flex gap-2 items-center cursor-pointer">

            <img
              src={`${profileImgURL || "NoProfile.png"}`}
              id="PostCard-profile-pic"
              className="rounded-full" />

            <h5>{post?.name}</h5>

            {post?.trustedResponderPost && (
              <span className="ViewPost-Category">Responder</span>
            )}
          </div>
        </Link>

        <h2 className="text-2xl font-bold">
          {post?.title}
        </h2>

        <div className="px-3 py-3">{parse(post?.content)}</div>
        <Prism />

        {post?.pollQuestion && (
          <div id="ViewPost_Poll_Div">
            <h5>Poll </h5>
            <p>{post?.pollQuestion}</p>
            <ul>
              {post?.pollOptions?.map((option, index) => {
                let parsedOption = JSON.parse(option).option;
                let parsedVote = JSON.parse(option).vote;
                let individualPollVote = Math.floor(
                  Number(JSON.parse(option).vote)
                );

                let percentage = (individualPollVote / totalPollVotes) * 100;
                percentage = percentage.toFixed(0);
                if (isNaN(percentage)) {
                  percentage = 0;
                }

                return (
                  <li
                    className={`${index === selectedIndex ? "active" : ""
                      } cursor-pointer`}
                    onClick={() => {
                      updatePoll(
                        post.$id,
                        index,
                        parsedOption,
                        parsedVote,
                        userData.$id
                      );
                      setselectedIndex(index);
                    }}
                    key={parsedOption}
                  >
                    <div className="ViewPost_Poll_Option">{parsedOption}</div>
                    <div className="ViewPost_Overlay_Poll">{percentage}%</div>
                    <div
                      style={{
                        width: `${percentage}%`,
                      }}
                      className={`${index === selectedIndex
                        ? `PollPercentageMeter active`
                        : "PollPercentageMeter"
                        }`}
                    ></div>
                  </li>
                );
              })}
            </ul>

            {isPollOpinionVisible && (
              <div id="ViewPost_Poll_Answer">
                <span>{post?.pollAnswer}</span>
              </div>
            )}
            <div className="flex gap-3 ViewPost_Total_Poll_Votes">
              <span>Total Votes :</span>
              <span>{totalPollVotes}</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ViewPostMainContent;