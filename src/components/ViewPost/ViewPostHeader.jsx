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
import { FaComment } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
import { dateFormatFunc } from "@/helpers/format-dates";
import { deleteQuestion } from "@/lib/posts";
import { useNotificationContext } from "@/context/NotificationContext";
import { useSelector } from "react-redux";

const ViewPostHeader = ({ post }) => {
    console.log(post)
    const userData = useSelector((state) => state?.auth?.userData);
    const isAuthor = post && userData ? post.userId === userData.$id : false;
    const { setNotification } = useNotificationContext();
    const navigate = useNavigate();


    const removePost = async () => {
        const flag = await deleteQuestion(post);
        if (flag) {
            setNotification({ message: "Post deleted", type: "success" });
            navigate("/");
        } else {
            setNotification({ message: "Post is not deleted", type: "error" })
        }
    };

    return (
        <div className="flex justify-between mx-3 mt-1 relative items-center">
            {/* Below div contains category, date, views, comment count */}
            <div className="flex gap-3 items-center">
                <span className="tag-style">{post?.category}</span>
                <span className="tag-style">{dateFormatFunc(post?.$createdAt) || ""}</span>
                <span className="flex gap-1 items-center tag-style">
                    <span>{post?.views}</span>
                    <IoEyeSharp />
                </span>
                <span className="flex gap-2 items-center tag-style">
                    <span>{post?.commentCount}</span>
                    <FaComment />
                </span>
            </div>

            {(isAuthor || userData?.$id === conf?.myPrivateUserID) && (
                <ul className="flex gap-4 items-center">
                    <AlertDialog>
                        <AlertDialogTrigger>
                            <li className="cursor-pointer text-xl">
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
                        className="cursor-pointer"
                        onClick={() => navigate(`/EditQuestion/${post?.$id}`)}
                    >
                        <Icons.edit className="text-xl" />
                    </li>
                </ul>
            )}
        </div>
    );
};

export default ViewPostHeader;
