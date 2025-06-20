import appwriteService from "@/appwrite/config";
import { getInitialPost } from "@/store/postsSlice";
import { useDispatch } from "react-redux";
const increaseViews = async (PostId) => {
    const dispatch = useDispatch();
    const previesViews = await appwriteService.getPost(PostId);
    const updateViews = await appwriteService.updatePostViews(
        PostId,
        previesViews.views + 1,
        previesViews.commentCount
    );
    dispatch(getInitialPost({ initialPosts: [updateViews] }));
};

export default increaseViews;