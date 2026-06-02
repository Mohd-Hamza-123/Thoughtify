import { toast } from "sonner"
import { ChatRTE } from '..';
import React, { useRef } from 'react'
import { Button } from '../ui/button';
import { useSelector } from 'react-redux';
import { useForm } from "react-hook-form";
import realTime from '@/appwrite/realTime';
import appwriteService from '@/appwrite/config';
import { useQueryClient } from "@tanstack/react-query";

const CommentRTE = ({ slug }) => {
    const queryClient = useQueryClient();
    const editorRef = useRef(null)
    const authStatus = useSelector((state) => state?.auth?.status)
    const userData = useSelector((state) => state?.auth?.userData)

    const { control, handleSubmit, getValues } = useForm();

    const Submit = async (data) => {

        clearEditorContent();

        if (!authStatus) {
            toast.error("Please Login")
            return
        }

        if (!data.commentContent) {
            toast.error("Comment not posted")
            return
        }

        try {
            const post = await appwriteService.getPost(slug)

            if (post?.opinionsFrom === 'Responders' && profileData?.trustedResponder && post?.userId !== userData?.$id) {
                toast.error("Only Responders can Comment on this post.")
                return
            }

            // console.log(post)
            // console.log(data)

            const dbComment = await realTime.createComment({
                ...data,
                postId: post?.$id,
                name: userData?.name,
                category: post?.category,
                profile : userData.$id
            });

            queryClient.setQueryData(['comments', slug], (oldData) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    pages: oldData.pages.map((page) => ({
                        ...page,
                        comments: [dbComment, ...page.comments],
                    })),
                };
            });


            toast.success("Comment Posted")


            setTimeout(() => {
                let newComment = document.getElementById(`Comment${dbComment?.$id}`)
                console.log(newComment)
                if (newComment) {
                    newComment.focus()
                }
            }, 1000);


            // if (authId !== post?.userId) {
            //     // Getting Post Uploader profile to know whether he follows you or not.
            //     const getPostUploaderProfile = await profile.listProfile({ slug: post?.userId });


            //     let followersArr = getPostUploaderProfile?.documents[0]?.followers
            //     followersArr = followersArr?.map((obj) => JSON.parse(obj))

            //     const isNotificationSend = followersArr?.findIndex((profile) => profile.profileID === authId);

            //     // If He follows you , notification will be sent
            //     if (isNotificationSend !== -1) {
            //         const createNotification = await notification.createNotification({ content: `${name} has commented on your post.`, isRead: false, slug: `/post/${post?.$id}/${dbCommnet?.$id}`, name, userID: authId, postId: post.$id, userIDofReceiver: post?.userId, userProfilePic: myUserProfile?.profileImgURL });
            //     }
            // }

            // if (postCommentCount || postCommentCount === 0) {

            //     appwriteService.updatePostViews(postId, post.views, postCommentCount + 1)
            //         .then((res) => {
            //             setpostCommentCount((prev) => prev + 1)
            //             console.log(res)
            //             dispatch(getInitialPost({ initialPosts: [res] }))
            //         })
            //         .catch((error) => console.log(error))
            // } else {

            //     appwriteService.updatePostViews(postId, post.views, post.commentCount + 1)
            //         .then((res) => {
            //             setpostCommentCount((prev) => post.commentCount + 1)
            //             dispatch(getInitialPost({ initialPosts: [res] }))
            //         })
            //         .catch((error) => console.log(error))
            // }
        } catch (error) {
            console.log(error)

            toast.error("Comment not Posted")
        }

    };


    const clearEditorContent = () => {
        if (editorRef.current) {
            editorRef.current.setContent('');
        }
    }
    return (
        <form onSubmit={handleSubmit(Submit)}>
            <div>
                <ChatRTE
                    control={control}
                    name="commentContent"
                    defaultValue={getValues("commentContent")}
                    editorRef={editorRef}
                    clearEditorContent={clearEditorContent}
                />
            </div>
            <div className="flex justify-end mt-3">
                <Button
                    id='Chat_Your_Opinion_Button'
                    type="submit"
                    className="border-1 p-2 rounded-md"
                >
                    Give Opinion
                </Button>
            </div>
        </form>
    )
}

export default CommentRTE