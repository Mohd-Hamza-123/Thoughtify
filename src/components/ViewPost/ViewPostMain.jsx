import Prism from "../Prism";
import parse from "html-react-parser";
import { Link } from "react-router-dom";
import { updatePoll } from "@/lib/posts";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";

const ViewPostMain = ({ post }) => {

  const isPollOpinionVisible = true;
  const [selectedChoice, setSelectedChoice] = useState(null);
  const userData = useSelector((state) => state?.auth?.userData);

  const update = async (choice) => {
    await updatePoll({ post, userData, choice });
  };

  useEffect(() => {
    const voters = post?.pollVotersID?.map((obj) => JSON.parse(obj));
    const myVote = voters?.find((obj) => obj?.userId === userData?.$id);
    if (myVote) setSelectedChoice(myVote?.choice);
  }, [post]);

  return (
    <div className="mt-6">
      <div className="mx-auto bg-white/80 dark:bg-slate-900/70 overflow-hidden">
        <div className="p-5 md:p-6">
          <Link to={`/profile/${post?.userId}`}>
            <div className="flex gap-3 items-center cursor-pointer">
              <img
                src={post?.profileImage.replace("/preview", "/view")}
                className="rounded-full h-10 w-10 object-cover ring-2 ring-white dark:ring-slate-800 shadow-sm"
                alt="avatar"
              />
              <div className="flex flex-col">
                <h5 className="text-sm font-medium text-slate-800 dark:text-slate-100">
                  {post?.name}
                </h5>
                <div className="flex items-center gap-2">
                  {post?.trustedResponderPost && (
                    <span className="text-[11px] px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                      Responder
                    </span>
                  )}
                  <span className="text-xs text-slate-400">
                    {new Date(post?.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </Link>

          <h2 className="text-2xl md:text-3xl font-extrabold mt-4 tracking-tight text-slate-900 dark:text-white">
            {post?.title}
          </h2>

          <div className="prose prose-sm dark:prose-invert max-w-none mt-4 px-1 py-2 text-slate-700 dark:text-slate-300">
            {parse(post?.content)}
          </div>

          <div className="mt-4">
            <Prism />
          </div>

          {post?.pollQuestion && (
            <div className="mt-6">
              <h5 className="text-center text-slate-500 text-sm">Poll</h5>
              <h4 className="text-xl md:text-2xl font-semibold text-slate-800 dark:text-slate-100 mt-2 text-center">
                {post?.pollQuestion}
              </h4>

              <ul className="my-4 flex flex-col gap-3">
                {post?.pollOptions?.map((option, index) => {
                  const { option: choice, vote } = JSON.parse(option);
                  const totalVotes = post?.pollVotersID?.length;
                  let percentage = (vote / totalVotes) * 100;
                  percentage = percentage.toFixed(0);
                  if (isNaN(percentage)) percentage = 0;
                  return (
                    <li
                      key={choice}
                      className="group"
                      onClick={() => update(choice)}
                    >
                      <div
                        className={`relative w-full border rounded-lg overflow-hidden transition-shadow duration-150 ${
                          choice === selectedChoice
                            ? "ring-2 ring-blue-400 shadow-md"
                            : "border-slate-200 dark:border-slate-700 hover:shadow-sm"
                        }`}
                      >
                        <div className="relative z-10 flex justify-between items-center p-3 md:p-4 gap-4">
                          <span className="text-base md:text-lg font-medium text-slate-900 dark:text-slate-100">
                            {choice}
                          </span>
                          <span className="text-sm md:text-base text-slate-600 dark:text-slate-300">
                            {percentage}%
                          </span>
                        </div>

                        {/* Background bar */}
                        <div
                          aria-hidden="true"
                          className={`absolute left-0 top-0 h-full z-0 transition-all duration-500 ease-in-out`}
                          style={{
                            width: `${percentage}%`,
                            // subtle gradient for selected vs unselected
                          }}
                        >
                          <div
                            className={`h-full ${
                              choice === selectedChoice
                                ? "bg-gradient-to-r from-blue-400 to-blue-500"
                                : "bg-slate-200/70 dark:bg-slate-700/60"
                            }`}
                          />
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {isPollOpinionVisible && (
                <div className="mt-2 px-2 text-sm text-slate-600 dark:text-slate-300">
                  <span className="font-medium">Opinion:</span>{" "}
                  <span>{post?.pollAnswer}</span>
                </div>
              )}

              <div className="flex items-center justify-between gap-3 mt-4 px-2">
                <div className="text-sm text-slate-600 dark:text-slate-300">
                  Total Votes :
                </div>
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {post?.pollVotersID?.length || 0}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewPostMain;
