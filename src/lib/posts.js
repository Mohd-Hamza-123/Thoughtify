import profile from "@/appwrite/profile";
import appwriteService from "@/appwrite/config";
import convertToWebPFile from "@/helpers/convert-image-into-webp";
import conf from "@/conf/conf";

export const updateLikeCount = async (post, myUserProfile) => {
    console.log(post)
    console.log(myUserProfile)
    try {

        if (!post || !myUserProfile) throw new Error("Post or MyUserProfile is not defined")

        if (myUserProfile?.likedQuestions?.includes(post?.$id)) {

            const updatePost = await appwriteService.updatePost_Like_DisLike({
                postId: post?.$id,
                like: post?.like - 1,
                dislike: post?.dislike,
            })

            const like_post_array = myUserProfile?.likedQuestions?.filter((postId) => postId !== post?.$id)

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

            const dislike_post_array = myUserProfile?.dislikedQuestions?.filter((postId) => postId !== post?.$id)

            const like_post_array = [...myUserProfile?.likedQuestions, post?.$id]

            const updatePost = await appwriteService.updatePost_Like_DisLike({
                postId: post?.$id,
                like: post?.like + 1,
                dislike: post?.dislike,
            });

            console.log(updatePost)

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
        }

    } catch (error) {
        console.log(error)
        return null
    }
}

export const uploadQuestionWithImage = async (
    data,
    userData,
    initialPostData,
    uploaderProfile,
) => {
    let imageId = null
    const isAdmin = userData?.labels?.includes("admin") ? true : false
    console.log(isAdmin)
    try {

        const {
            categoryValue,
            thumbnailFile,
            pollQuestion,
            pollOptions,
        } = initialPostData

        const webpFile = await convertToWebPFile(thumbnailFile);
        const queCreatedImage = await appwriteService.createThumbnail({ file: webpFile })
        imageId = queCreatedImage?.$id

        const imageURL = await appwriteService.getThumbnailPreview(queCreatedImage?.$id)
        const queImage = JSON.stringify({ imageURL: imageURL, imageID: queCreatedImage?.$id })


        const dbPost = await appwriteService.createPost({
            ...data,
            queImage,
            userId: userData?.$id,
            pollQuestion,
            pollOptions: pollOptions?.map((obj) => JSON.stringify(obj)) || [],
            name: userData?.name,
            trustedResponderPost: isAdmin,
        }, categoryValue);

        if (dbPost) {
            return dbPost
        } else {
            if (imageId) await appwriteService.deleteThumbnail(imageId)
            return null
        }

    } catch (error) {
        throw new Error(error)
    }
}

export const deleteQuestion = async (post) => {
    const post_id = post?.$id
    const { imageID } = JSON.parse(JSON.parse(post?.queImage))
    try {
        if (imageID) await appwriteService.deleteThumbnail(imageID)
        await appwriteService.deletePost(post_id)
        return true
    } catch (error) {
        return false
    }
}

export const updatePoll = async ({ post, userData, choice }) => {

    try {

        const { $id: postId, pollVotersID, pollOptions } = post
        const { $id: userId } = userData
        console.log("My ID : ", userId)
        // console.log(pollVotersID)
        let voters = pollVotersID?.map((obj) => JSON.parse(obj));

        const uniqueVotersMap = new Map();
        voters.forEach((voter) => {
            uniqueVotersMap.set(voter.userId, voter);
        });
        voters = [...uniqueVotersMap.values()];

        console.log(voters)
        const parsedPollOptions = pollOptions.map((obj) => JSON.parse(obj))

        let myVote = voters?.find((obj) => obj?.userId === userId)
        console.log(myVote)

        const previous_choice = myVote?.choice

        let voters_array = [];
        let updated_pollOptions = [];

        // console.log(myVote)
        if (!myVote) {
            console.log("I not voted")
            // console.log(voters_array)
            voters_array = [...voters, { userId, choice }].map((obj) => JSON.stringify(obj))
            console.log(voters_array)
            updated_pollOptions = parsedPollOptions.map((obj) =>
                obj.option === choice ? { ...obj, vote: obj.vote + 1 } : obj)
        } else {
            console.log("I have already voted")
            if (previous_choice === choice) {

                voters_array = voters.filter((obj) => obj.userId !== userId)
                voters_array = voters_array.map((obj) => JSON.stringify(obj))
                console.log(voters_array)

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

                console.log(voters_array)
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

        const response = await appwriteService.updatePost(postId, {
            pollVotersID: voters_array,
            pollOptions: updated_pollOptions
        })

        return response
    } catch (error) {
        throw new Error(error)
    }

}

export const uploadPostWithUnsplashAPI = async (initialPostData, data, userData, uploaderProfile) => {

    try {
        const isAdmin = userData?.labels?.includes("admin") ? true : false

        const {
            categoryValue,
            pollOptions,
            pollQuestion,
        } = initialPostData


        const response = await fetch(`https://api.unsplash.com/search/photos?query=${categoryValue}&per_page=10&client_id=${conf.unsplashApiKey}`)
        if (response.ok) {
            const UnsplashRes = await response.json();
            const ImgArrUnsplash = UnsplashRes.results
        
            const randomIndex = Math.floor(Math.random() * 10);
            const ImgURL = ImgArrUnsplash[randomIndex]?.urls?.raw
            const queImage = JSON.stringify({ imageURL: ImgURL, imageID: null })

            const dbPost = await appwriteService.createPost({
                ...data,
                userId: userData.$id,
                queImage,
                pollQuestion,
                pollOptions: pollOptions.map((obj) => JSON.stringify(obj)),
                name: userData?.name,
                trustedResponderPost : isAdmin,
            }, categoryValue);
            return dbPost
        }

        return null
    } catch (error) {
        console.log(error)
        return null
    }

}
