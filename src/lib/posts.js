import appwriteService from "@/appwrite/config";
import profile from "@/appwrite/profile";

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