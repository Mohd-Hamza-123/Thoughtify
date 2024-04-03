import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userProfile: {},
    userProfileImgURL: '',
    totalPostsbyMe: 0,
    totalCommentsbyMe: 0,
}

const profileSlice = createSlice({
    name: 'profileSlice',
    initialState,
    reducers: {
        getUserProfile: (state, action) => {
            const { userProfile, userProfileImgURL } = action.payload
            state.userProfile = userProfile
            state.userProfileImgURL = userProfileImgURL
        },
        getTotalPostByMe: (state, action) => {
            state.totalPostsbyMe = action.payload.totalPostsbyMe
        },
        getTotalCommentsByMe: (state, action) => {
            state.totalCommentsbyMe = action.payload.totalCommentsbyMe
        }
    }
})


export const { getUserProfile, getTotalPostByMe, getTotalCommentsByMe } = profileSlice.actions;
export default profileSlice.reducer

