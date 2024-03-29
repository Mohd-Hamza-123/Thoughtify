import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userProfile: {},
    userProfileImgURL: ''
}

const profileSlice = createSlice({
    name: 'profileSlice',
    initialState,
    reducers: {
        getUserProfile: (state, action) => {
            const { userProfile, userProfileImgURL } = action.payload
            state.userProfile = userProfile
            state.userProfileImgURL = userProfileImgURL
        }
    }
})


export const { getUserProfile } = profileSlice.actions;
export default profileSlice.reducer

