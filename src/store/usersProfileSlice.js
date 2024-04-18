import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userProfileArr: [],
    flag: false,
};

const userProfileSlice = createSlice({
    name: "other",
    initialState,
    reducers: {
        getOtherUserProfile: (state, action) => {
            let arr = []
            arr = [...state.userProfileArr, ...action.payload.userProfileArr]
            // console.log(arr)
            let uniqueArray = Array.from(new Map(arr.map(obj => [obj?.$id, obj])).values());
            state.userProfileArr = uniqueArray
        },
    },
});

export const { getOtherUserProfile } = userProfileSlice.actions;
export default userProfileSlice.reducer;