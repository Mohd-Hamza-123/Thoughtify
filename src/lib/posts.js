import appwriteService from "@/appwrite/config";
import profile from "@/appwrite/profile";
import convertToWebPFile from "@/helpers/convert-image-into-webp";
import { currentFormattedDate } from "@/helpers/format-dates";

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
    try {
        const { categoryValue, thumbnailFile } = initialPostData
        const webpFile = await convertToWebPFile(thumbnailFile)
        const queCreatedImage = await appwriteService.createThumbnail({ file: webpFile })
        const imageURL = await appwriteService.getThumbnailPreview(queCreatedImage?.$id)
        const queImage = JSON.stringify({ imageURL: imageURL, imageID: queCreatedImage?.$id })

        const dbPost = await appwriteService.createPost({
            ...data,
            queImage: JSON.stringify(queImage),
            userId: userData?.$id,
            pollQuestion: uploaderProfile?.pollQuestion,
            pollOptions: uploaderProfile?.pollOptions,
            name: userData?.name,
            date: currentFormattedDate(),
            trustedResponderPost: uploaderProfile?.documents[0].trustedResponder,
        }, categoryValue);

        return dbPost

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