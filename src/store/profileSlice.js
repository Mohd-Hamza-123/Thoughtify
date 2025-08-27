import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    myPosts: 0,
    userProfile: null,
    flagForBookmark: false,
    filteredBookmarkPosts: [],
}

const profileSlice = createSlice({
    name: 'profileSlice',
    initialState,
    reducers: {
        userProfile: (state, action) => {
            state.userProfile = action.payload?.userProfile
        },
        getTotalPostByMe: (state, action) => {
            state.totalPostsbyMe = action.payload.totalPostsbyMe
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
    getFilteredBookmarkPosts
} = profileSlice.actions;

export default profileSlice.reducer

