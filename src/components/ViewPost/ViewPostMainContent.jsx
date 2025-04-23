import Prism from "../Prism";
import React, { useRef ,useEffect} from "react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaComment } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
import NoProfile from "../../assets/NoProfile.png";
import { dateFormatFunc } from "@/helpers/format-dates";
import conf from "@/conf/conf";

const ViewPostMainContent = ({ post }) => {
    // console.log(post);
    const ellipsis_Vertical = useRef();
    const ViewPost_ellipsis_Vertical = useRef();

    const userData = useSelector((state) => state?.auth?.userData);
    // console.log(userData);
    const isAuthor = post && userData ? post.userId === userData.$id : false;

  

    return (
        <div className="p-2 shadow-lg">
            <div className="flex justify-between mx-3 mt-1 relative items-center">
                <div className="flex gap-3">
                    {/* this is category */}
                    <span className="rounded-md px-2 bg-gray-200">{post?.category}</span>
                    <div className="flex gap-3">
                        {/* this is date */}
                        <span>{dateFormatFunc(post?.date) || ""}</span>
                        {/* this is views count */}
                        <div className="flex gap-1 items-center">
                            <span>{post?.views}</span>
                            <IoEyeSharp />
                        </div>
                        {/* this is comment count */}
                        <div className="flex gap-2 items-center">
                            <span>{post?.commentCount}</span>
                            <FaComment />
                        </div>
                    </div>
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
                        <div className="rounded-full">
                            <img
                                src={`${profileImgURL ? profileImgURL : NoProfile}`}
                                id="PostCard-profile-pic"
                                className="rounded-full"
                            />
                        </div>
                        <div id="ViewPostName">
                            <h5>{post?.name}</h5>
                        </div>
                        {post?.trustedResponderPost && (
                            <div>
                                <span className="ViewPost-Category">Responder</span>
                            </div>
                        )}
                    </div>
                </Link>
                <div className="mt-3 mb-2">
                    <h2 id="ViewPost-Title" className="text-3xl font-bold">
                        {post?.title}
                    </h2>
                </div>

                <div id="ViewPost-parse">{parse(post?.content)}</div>
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
        </div>
    );
};

export default ViewPostMainContent;
