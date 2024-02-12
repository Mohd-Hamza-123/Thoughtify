import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    userProfile: {}
}

const profileSlice = createSlice({
    name: 'profileSlice',
    initialState,
    reducers: {
        getUserProfile: (state, action) => {
            state.userProfile = action.payload.userProfile
        }
    }
})


export const { getUserProfile } = profileSlice.actions;
export default profileSlice.reducer