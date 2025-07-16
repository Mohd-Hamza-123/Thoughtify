import Prism from "../Prism";
import parse from "html-react-parser";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { updatePoll } from "@/lib/posts";

const ViewPostMain = ({ post }) => {

    const isPollOpinionVisible = true;
    const [selectedChoice, setSelectedChoice] = useState(null);
    const userData = useSelector((state) => state?.auth?.userData);
    console.log(selectedChoice)
    const update = async (choice) => {
        await updatePoll({ post, userData, choice })
    };

    useEffect(() => {
        const voters = post?.pollVotersID?.map((obj) => JSON.parse(obj));
        const myVote = voters?.find((obj) => obj?.userId === userData?.$id);
        if (myVote) {
            setSelectedChoice(myVote?.choice);
        }
    }, [post])

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
                            let percentage = (vote / totalVotes) * 100;
                            percentage = percentage.toFixed(0);
                            if (isNaN(percentage)) percentage = 0;
                            return (
                                <li
                                    key={choice}
                                    className={`cursor-pointer`}
                                    onClick={() => update(choice)}>
                                    <div className={`flex justify-between px-2 relative w-full bg-slate-400/20 border  rounded-sm ${choice === selectedChoice ? "border-blue-500" : "border-slate-600"}`}>
                                        <span className="text-lg z-10">{choice}</span>
                                        <span className="z-10">{percentage}%</span>
                                        <span style={{ width: `${percentage}%` }}
                                            className={`absolute left-0 top-0 h-full ${choice === selectedChoice ? "bg-blue-400" : "bg-gray-300"} border z-0 transition-all`}
                                        ></span>
                                    </div>
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
