import appwriteService from "@/appwrite/config";

const increaseViews = async (PostId) => {
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

export default increaseViews;