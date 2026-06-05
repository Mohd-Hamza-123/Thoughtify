import React, { memo } from "react";
import { Icons } from "../index";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const SubComment = ({ subComment = [], deleteSubComment, commentId }) => {

    const userData = useSelector((state) => state.auth.userData)
    const myId = userData.$id
    // console.log(myId)

    return (
        <div className="mt-4 space-y-3">
            {subComment?.map((item, index) => {
                const parsedComment = JSON.parse(item);
                // console.log(parsedComment)
                const { username, userId, comment } = parsedComment;

                console.log(userId === myId)
                return (
                    <div
                        key={`${comment}-${userId}-${index}`}
                        className="group relative flex gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
                    >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300">
                            {username?.charAt(0)?.toUpperCase()}
                        </div>

                        <div className="min-w-0 flex-1">
                            <Link
                                to={`/profile/${userId}`}
                                className="text-sm font-semibold text-slate-900 hover:text-indigo-600 dark:text-slate-100 dark:hover:text-indigo-400"
                            >
                                {username}
                            </Link>

                            <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700 dark:text-slate-300">
                                {comment}
                            </p>
                        </div>

                        {myId === userId && (
                            <button
                                onClick={() => deleteSubComment(index, commentId, subComment)}
                            >
                                <Icons.trashcan />
                            </button>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default memo(SubComment);