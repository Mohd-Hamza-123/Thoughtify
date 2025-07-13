import React from 'react'
import Prism from "../Prism";
import parse from "html-react-parser"
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';

const ViewPostMain = ({ post }) => {
    const userData = useSelector((state) => state?.auth?.userData);
    return (
        <div className="mt-3">

            <Link to={`/profile/${post?.userId}`}>
                <div className="flex gap-2 items-center cursor-pointer">

                    <img
                        src={`${"NoProfile.png"}`}
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
    )
}

export default ViewPostMain