import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userProfile: {},
    userProfileImgURL: '',
    totalPostsbyMe: 0,
    totalCommentsbyMe: 0,
    filteredBookmarkPosts: [],
    flagForBookmark: false,
}

const profileSlice = createSlice({
    name: 'profileSlice',
    initialState,
    reducers: {
        userProfile: (state, action) => {
            // const { userProfile, userProfileImgURL } = action.payload
            state.userProfile = action.payload?.userProfile
            // state.userProfileImgURL = userProfileImgURL
        },
        getTotalPostByMe: (state, action) => {
            state.totalPostsbyMe = action.payload.totalPostsbyMe
        },
        getTotalCommentsByMe: (state, action) => {
            state.totalCommentsbyMe = action.payload.totalCommentsbyMe
        },
        getFilteredBookmarkPosts: (state, action) => {
            const { flagForBookmark, filteredBookmarkPosts } = action.payload;
            let array = [...state.filteredBookmarkPosts, ...filteredBookmarkPosts]
            let uniqueArray = Array.from(new Map(array.map(obj => [obj.$id, obj])).values());
            state.filteredBookmarkPosts = uniqueArray
        }
    }
})


export const {
    userProfile,
    getTotalPostByMe,
    getTotalCommentsByMe,
    getFilteredBookmarkPosts } = profileSlice.actions;
export default profileSlice.reducer

