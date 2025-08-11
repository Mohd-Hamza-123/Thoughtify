import React, { useRef } from 'react'
import { useForm } from "react-hook-form";
import { ChatRTE } from '..';
import { Button } from '../ui/button';


const CommentRTE = () => {


    const editorRef = useRef(null)
    const { control, handleSubmit, getValues } =
        useForm();

    const Submit = async (data) => {

        clearEditorContent();

        if (!authStatus) {
            setNotification({ message: "Please Login", type: 'error' })
            return
        }

        if (!data.commentContent) {
            setNotification({ message: "Comment not posted", type: 'error' })
            return
        }

        try {


            const post = await appwriteService.getPost(slug)

            if (post?.opinionsFrom === 'Responders' && profileData?.trustedResponder && post?.userId !== userData?.$id) {
                setNotification({ message: "Only Responders can Comment on this post.", type: 'error' })
                return
            }

            // console.log(post)
            // console.log(data)

            const dbCommnet = await realTime.createComment({
                ...data,
                postId: post?.$id,
                authId,
                name,
                category: post?.category,
            });
            console.log(dbCommnet)

            setNotification({ message: "Comment Posted", type: 'success' })

            return

            setTimeout(() => {
                let newComment = document.getElementById(`Comment${dbCommnet?.$id}`)
                console.log(newComment)
                if (newComment) {
                    newComment.focus()
                }
            }, 1000);


            if (authId !== post?.userId) {
                // Getting Post Uploader profile to know whether he follows you or not.
                const getPostUploaderProfile = await profile.listProfile({ slug: post?.userId });


                let followersArr = getPostUploaderProfile?.documents[0]?.followers
                followersArr = followersArr?.map((obj) => JSON.parse(obj))

                const isNotificationSend = followersArr?.findIndex((profile) => profile.profileID === authId);

                // If He follows you , notification will be sent
                if (isNotificationSend !== -1) {
                    const createNotification = await notification.createNotification({ content: `${name} has commented on your post.`, isRead: false, slug: `/post/${post?.$id}/${dbCommnet?.$id}`, name, userID: authId, postId: post.$id, userIDofReceiver: post?.userId, userProfilePic: myUserProfile?.profileImgURL });
                }
            }

            if (postCommentCount || postCommentCount === 0) {

                appwriteService.updatePostViews(postId, post.views, postCommentCount + 1)
                    .then((res) => {
                        setpostCommentCount((prev) => prev + 1)
                        console.log(res)
                        dispatch(getInitialPost({ initialPosts: [res] }))
                    })
                    .catch((error) => console.log(error))
            } else {

                appwriteService.updatePostViews(postId, post.views, post.commentCount + 1)
                    .then((res) => {
                        setpostCommentCount((prev) => post.commentCount + 1)
                        dispatch(getInitialPost({ initialPosts: [res] }))
                    })
                    .catch((error) => console.log(error))
            }
        } catch (error) {
            console.log(error)
            setNotification({ message: "Comment not Posted", type: 'error' })
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