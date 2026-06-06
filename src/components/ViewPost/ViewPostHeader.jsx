import { Icons } from "..";
import { toast } from "sonner"
import conf from "@/conf/conf";
import { Spinner } from "../ui/spinner";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FaComment } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
import { deleteQuestion } from "@/lib/posts";
import { useNavigate } from "react-router-dom";
import { dateFormatFunc } from "@/helpers/format-dates";
import { useQueryClient, useMutation } from "@tanstack/react-query";
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


const ViewPostHeader = ({ post }) => {

    const [open, setOpen] = useState(false);
    const userData = useSelector((state) => state?.auth?.userData);
    const isAuthor = post && userData ? post.userId === userData.$id : false;
    // console.log(isAuthor)

    const navigate = useNavigate();
    const queryClient = useQueryClient()


    const deleteMutation = useMutation({
        mutationFn: () => deleteQuestion(post),

        onSuccess: () => {
            queryClient.setQueryData(["posts"], (oldData) => {
                if (!oldData) return oldData;

                return {
                    ...oldData,
                    pages: oldData.pages.map((page) => ({
                        ...page,
                        documents: page.documents.filter(
                            (previous) => previous?.$id !== post?.$id
                        ),
                    })),
                };
            });

            toast.success("Post deleted");
            setOpen(false);
            navigate("/");
        },

        onError: (error) => {
            const message = error instanceof Error ? error.message : error;
            console.error(message);
            toast.error(message);
        },
    });

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
            {(isAuthor || userData?.email === conf.myPrivateUserID) && (
                <ul className="flex gap-3 items-center">
                    <AlertDialog open={open} onOpenChange={setOpen}>
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
                                <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    disabled={deleteMutation.isPending}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (isAuthor || userData?.email === conf.myPrivateUserID) deleteMutation.mutate();
                                    }}
                                >
                                    {deleteMutation.isPending ? (
                                        <Spinner className="size-4" />
                                    ) : (
                                        "Continue"
                                    )}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <li
                        className="cursor-pointer rounded-full p-2 hover:bg-slate-100 transition"
                        onClick={() => navigate(`/edit-question/${post?.$id}`)}
                        title="Edit post">
                        <Icons.edit className="text-base" />
                    </li>
                </ul>
            )}
        </div>
    );
};

export default ViewPostHeader;
