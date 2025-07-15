import Prism from "../Prism";
import parse from "html-react-parser";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { updatePoll } from "@/lib/posts";

const ViewPostMain = ({ post }) => {
    console.log(post)
    const isPollOpinionVisible = true;
    const [selectedIndex, setSelectedIndex] = useState(0);
    const userData = useSelector((state) => state?.auth?.userData);

    const update = async (choice) => {
        await updatePoll({ post, userData, choice })
    };

    return (
        <div className="mt-3">

            <Link to={`/profile/${post?.userId}`}>
                <div className="flex gap-2 items-center cursor-pointer">
                    <img src="NoProfile.png" className="rounded-full" />
                    <h5>{post?.name}</h5>
                    {post?.trustedResponderPost && <span className="ViewPost-Category">Responder</span>}
                </div>
            </Link>

            <h2 className="text-2xl font-bold">{post?.title}</h2>
            <div className="px-3 py-3">{parse(post?.content)}</div>

            <Prism />

            {post?.pollQuestion && (
                <div>
                    <h5 className="text-center">Poll</h5>
                    <h4 className="text-xl font-semibold">{post?.pollQuestion}</h4>
                    <ul className="my-3 flex flex-col gap-3">
                        {post?.pollOptions?.map((option, index) => {
                            const { option: choice, vote } = JSON.parse(option);
                            const totalVotes = post?.pollVotersID?.length;
                            console.log(vote,totalVotes)
                            let percentage = (vote / totalVotes) * 100;
                            percentage = percentage.toFixed(0);
                            if (isNaN(percentage)) percentage = 0;
                            return (
                                <li
                                    key={choice}
                                    className={`${index === selectedIndex ? "active" : ""
                                        } cursor-pointer`}
                                    onClick={() => update(choice)}>
                                    <div className="flex justify-between px-2 relative w-full">
                                        <span className="text-lg z-10">{choice}</span>
                                        <span className="z-10">{percentage}%</span>
                                        <span
                                            style={{ width: `${percentage}%` }}
                                            className="absolute left-0 top-0 h-full bg-blue-400/40 border border-blue-600 z-0 transition-all"
                                        ></span>
                                    </div>

                                    <div
                                        className={`${index === selectedIndex
                                            ? `PollPercentageMeter active`
                                            : "PollPercentageMeter"
                                            } ${percentage}`}
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

                    <div className="flex gap-3">
                        <span>Total Votes :</span>
                        <span>{post?.pollVotersID?.length}</span>
                    </div>

                </div>
            )}
        </div>
    );
};

export default ViewPostMain;
