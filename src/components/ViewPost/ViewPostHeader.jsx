import React from "react";
import conf from "@/conf/conf";
import { useNavigate } from "react-router-dom";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Icons } from "..";
import { useSelector } from "react-redux";
import { FaComment } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
import { deleteQuestion } from "@/lib/posts";
import { dateFormatFunc } from "@/helpers/format-dates";
import { useNotificationContext } from "@/context/NotificationContext";
import { useQueryClient } from "@tanstack/react-query";

const ViewPostHeader = ({ post }) => {

    const userData = useSelector((state) => state?.auth?.userData);
    const isAuthor = post && userData ? post.userId === userData.$id : false;
    console.log(isAuthor)

    const { setNotification } = useNotificationContext();
    const navigate = useNavigate();
    const queryClient = useQueryClient()

    const removePost = async () => {
        const flag = await deleteQuestion(post);
        queryClient.setQueryData(['posts'], (oldData) => {
            return {
                ...oldData,
                pages: oldData.pages.map((page) => ({
                    ...page,
                    documents: page.documents.filter((previous) => previous?.$id !== post?.$id),
                })),
            }
        })
        // let flag = false
        if (flag) {
            setNotification({ message: "Post deleted", type: "success" });
            navigate("/");
        } else {
            setNotification({ message: "Post is not deleted", type: "error" })
        }
    };

    return (
        <div className="flex justify-between items-center mx-1 md:mx-3 mt-2 relative">
            {/* Left: category, date, views, comment count */}
            <div className="flex gap-3 items-center flex-wrap">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium border border-indigo-100">
                    {post?.category}
                </span>

                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 text-slate-600 text-sm border border-slate-100">
                    {dateFormatFunc(post?.$createdAt) || ""}
                </span>

                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 text-slate-600 text-sm border border-slate-100">
                    <span className="text-sm font-semibold">{post?.views}</span>
                    <IoEyeSharp className="text-base" />
                </span>

                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 text-slate-600 text-sm border border-slate-100">
                    <span className="text-sm font-semibold">{post?.commentCount}</span>
                    <FaComment className="text-sm" />
                </span>
            </div>

            {/* Right: actions for author */}
            {(isAuthor || userData?.$id === conf?.myPrivateUserID) && (
                <ul className="flex gap-3 items-center">
                    <AlertDialog>
                        <AlertDialogTrigger>
                            <li className="cursor-pointer rounded-full p-2 hover:bg-red-50 text-red-600 transition-colors">
                                <Icons.trashcan />
                            </li>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Are you sure , you want to delete ?
                                </AlertDialogTitle>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={removePost}>
                                    Continue
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <li
                        className="cursor-pointer rounded-full p-2 hover:bg-slate-100 transition"
                        onClick={() => navigate(`/EditQuestion/${post?.$id}`)}
                        title="Edit post"
                    >
                        <Icons.edit className="text-base" />
                    </li>
                </ul>
            )}
        </div>
    );
};

export default ViewPostHeader;
