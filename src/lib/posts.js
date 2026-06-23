import profile from "@/appwrite/profile";
import appwriteService from "@/appwrite/config";

export const updateLikeCount = async (post, myUserProfile) => {

    try {

        if (!post || !myUserProfile) throw new Error("Post or MyUserProfile is not defined")
        const isPostLiked = myUserProfile?.likedQuestions?.includes(post?.$id)

        if (isPostLiked) {

            const currentPost = await appwriteService.getPost(post?.$id)
            const updatePost = await appwriteService.updatePost_Like_DisLike({
                postId: currentPost?.$id,
                like: currentPost?.like - 1,
            });

            const like_post_array = myUserProfile?.likedQuestions?.filter((postId) => postId !== currentPost?.$id);

            const updateProfile = await profile.updateProfileWithQueries({
                profileID: myUserProfile?.$id,
                likedQuestions: like_post_array,
            });

            return {
                post: updatePost,
                profile: updateProfile
            }
        } else {
            const isPostDisliked = myUserProfile?.dislikedQuestions?.includes(post?.$id)

            if (isPostDisliked) {

                const currentPost = await appwriteService.getPost(post?.$id)
                const updatePost = await appwriteService.updatePost_Like_DisLike({
                    postId: post?.$id,
                    like: currentPost?.like + 1,
                    dislike: currentPost?.dislike - 1,
                })
                const like_post_array = [...myUserProfile?.likedQuestions, post?.$id]
                const dislike_post_array = myUserProfile?.dislikedQuestions?.filter((postId) => postId !== post?.$id)

                const updateProfile =
                    await profile.updateProfileWithQueries({
                        profileID: myUserProfile?.$id,
                        likedQuestions: like_post_array,
                        dislikedQuestions: dislike_post_array,
                    });
                return {
                    post: updatePost,
                    profile: updateProfile
                }

            } else {

                const currentPost = await appwriteService.getPost(post?.$id)
                const updatePost = await appwriteService.updatePost_Like_DisLike({
                    postId: post?.$id,
                    like: currentPost?.like + 1,
                })

                const like_post_array = [...myUserProfile?.likedQuestions, post?.$id]
                const updateProfile =
                    await profile.updateProfileWithQueries({
                        profileID: myUserProfile?.$id,
                        likedQuestions: like_post_array,
                    });

                return {
                    post: updatePost,
                    profile: updateProfile,
                }
            }


        }

    } catch (error) {
        console.log(error)
        return null
    }
}
export const updateDislikeCount = async (post, myUserProfile) => {
    try {

        if (!post || !myUserProfile) throw new Error("Post or MyUserProfile is not defined")

        const isPostDisliked = myUserProfile?.dislikedQuestions?.includes(post?.$id)

        if (isPostDisliked) {

            const currentPost = await appwriteService.getPost(post?.$id)
            const updatePost = await appwriteService.updatePost_Like_DisLike({
                postId: currentPost?.$id,
                dislike: currentPost?.dislike - 1,
            })

            const dislike_post_array = myUserProfile?.dislikedQuestions?.filter((postId) => postId !== post?.$id)

            const updateProfile =
                await profile.updateProfileWithQueries({
                    profileID: myUserProfile?.$id,
                    dislikedQuestions: dislike_post_array,
                });

            return {
                post: updatePost,
                profile: updateProfile
            }

        } else {
            const isPostLiked = myUserProfile?.likedQuestions?.includes(post?.$id)
            if (isPostLiked) {
                const currentPost = await appwriteService.getPost(post?.$id)
                const updatePost = await appwriteService.updatePost_Like_DisLike({
                    postId: post?.$id,
                    like: currentPost?.like - 1,
                    dislike: currentPost?.dislike + 1,
                })
                const like_post_array = myUserProfile?.likedQuestions?.filter((postId) => postId !== post?.$id)
                const dislike_post_array = [...myUserProfile?.dislikedQuestions, post?.$id]
                const updateProfile =
                    await profile.updateProfileWithQueries({
                        profileID: myUserProfile?.$id,
                        likedQuestions: like_post_array,
                        dislikedQuestions: dislike_post_array,
                    });

                return {
                    post: updatePost,
                    profile: updateProfile
                }

            } else {

                const currentPost = await appwriteService.getPost(post?.$id)
                const updatePost = await appwriteService.updatePost_Like_DisLike({
                    postId: post?.$id,
                    dislike: currentPost?.dislike + 1,
                })
                const dislike_post_array = [...myUserProfile?.dislikedQuestions, post?.$id]
                const updateProfile =
                    await profile.updateProfileWithQueries({
                        profileID: myUserProfile?.$id,
                        dislikedQuestions: dislike_post_array,
                    });

                return {
                    post: updatePost,
                    profile: updateProfile
                }
            }
        }


    } catch (error) {

    }
}
export const deleteQuestion = async (post) => {
    const post_id = post?.$id
    const { imageID } = JSON.parse(post?.queImage)
    if (imageID) await appwriteService.deleteThumbnail(imageID)
    await appwriteService.deletePost(post_id)
}
export const updatePoll = async ({ post, userData, choice }) => {

    try {
        
        const { $id: postId, pollVotersID, pollOptions } = post
        const { $id: userId } = userData || {}

        const parsedPollOptions = pollOptions.map((obj) => JSON.parse(obj))
        let voters = pollVotersID.map((obj) => JSON.parse(obj));

        const uniqueVotersMap = new Map();
        voters.forEach((voter) => {
            uniqueVotersMap.set(voter.userId, voter);
        });
        voters = [...uniqueVotersMap.values()];

        let myVote = voters?.find((obj) => obj?.userId === userId)

        // console.log("voters : ", voters)
        // console.log(choice)
        // console.log(pollVotersID)
        // console.log("parsed Poll Options : ", parsedPollOptions)

        const previous_choice = myVote?.choice
        // console.log("myvote : ", myVote)
        // console.log(previous_choice)

        let voters_array = [];
        let updated_pollOptions = [];

        // console.log(myVote)
        if (!myVote) {
            // console.log("I not voted")
            // console.log(voters_array)
            voters_array = [...voters, { userId, choice }].map((obj) => JSON.stringify(obj))
            // console.log(voters_array)

            updated_pollOptions = parsedPollOptions.map((obj) =>
                obj.option === choice ? { ...obj, vote: obj.vote + 1 } : obj)
        } else {
            // console.log("I have already voted")
            if (previous_choice === choice) {

                voters_array = voters.filter((obj) => obj.userId !== userId)
                voters_array = voters_array.map((obj) => JSON.stringify(obj))
                // console.log(voters_array)

                updated_pollOptions = parsedPollOptions?.map((obj) => {
                    if (obj.option === choice) {
                        if (obj.vote <= 0) return { ...obj, vote: 0 }
                        return { ...obj, vote: obj.vote - 1 }
                    }
                    return obj
                })
            } else {

                voters_array = voters?.map((obj) => {
                    if (obj.userId === userId) {
                        return JSON.stringify({ ...obj, choice: choice })
                    }
                    return JSON.stringify(obj)
                })

                // console.log(voters_array)
                updated_pollOptions = parsedPollOptions?.map((obj) => {
                    if (obj.option === previous_choice) {
                        let vote = obj.vote - 1
                        if (vote < 0) vote = 0
                        return { ...obj, vote }
                    }
                    if (obj.option === choice) {
                        let vote = obj.vote + 1
                        return { ...obj, vote }
                    }
                    return obj
                })
            }
        }

        updated_pollOptions = updated_pollOptions?.map((obj) => JSON.stringify(obj))
        // console.log(updated_pollOptions)

        const payload = {
            pollVotersID: voters_array,
            pollOptions: updated_pollOptions
        }

        const response = await appwriteService.updatePost({ slug: postId, payload })
       
        return response
    } catch (error) {
        console.error(error instanceof Error ? error.message : error)
    }

}
export const bookMarkPost = async (postId, myUserProfile, isBookmarked) => {
    try {

        console.log(postId)
        console.log(myUserProfile)
        if (!postId || !myUserProfile) throw new Error("Post or MyUserProfile is not defined")
        if (isBookmarked) {
            let bookmarks = myUserProfile?.bookmarks
            bookmarks = bookmarks?.filter((bookmark) => bookmark !== postId)
            const updateProfile = await profile.updateEveryProfileAttribute({ profileID: myUserProfile.$id, bookmarks })
            return updateProfile
        } else {
            let bookmarks = myUserProfile?.bookmarks

            bookmarks = [...bookmarks, postId]
            const updateProfile = await profile.updateEveryProfileAttribute({ profileID: myUserProfile.$id, bookmarks })
            return updateProfile
        }
    } catch (error) {
        let message = error instanceof Error ? error.message : error
        console.log(message)

    }

}
export const increaseViews = async (PostId) => {
    try {
        const previesViews = await appwriteService.getPost(PostId);
        const updateViews = await appwriteService.updatePostViews(
            PostId,
            previesViews.views + 1,
            previesViews.commentCount
        );
        if (updateViews) {
            return updateViews
        } else {
            return false
        }
    } catch (error) {
        console.log(error)
        return false
    }

};


