import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    myPosts: 0,
    userProfile: null,
}

const profileSlice = createSlice({
    name: 'profileSlice',
    initialState,
    reducers: {
        userProfile: (state, action) => {
            state.userProfile = action.payload?.userProfile
        }
    }
})


export const {
    userProfile
} = profileSlice.actions;

export default profileSlice.reducer

