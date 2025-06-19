import appwriteService from "@/appwrite/config";
import { getInitialPost } from "@/store/postsSlice";

const increaseViews = async (PostId) => {
    const previesViews = await appwriteService.getPost(PostId);
    const updateViews = await appwriteService.updatePostViews(
        PostId,
        previesViews.views + 1,
        previesViews.commentCount
    );
    dispatch(getInitialPost({ initialPosts: [updateViews] }));
};

export default increaseViews;