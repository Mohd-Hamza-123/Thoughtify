import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    initialPosts: [],
    postUploaderProfilePic: [],
}

const postSlice = createSlice({
    name: 'postsSlice',
    initialState,
    reducers: {
        getInitialPost: (state, action) => {
            let array = [...state.initialPosts, ...action.payload.initialPosts]
            let uniqueArray = Array.from(new Map(array.map(obj => [obj.$id, obj])).values());
            state.initialPosts = uniqueArray
        },
        getpostUploaderProfilePic: (state, action) => {
            // console.log(action.payload)
            const { userId, profilePic } = action.payload;
            // console.log(profilePic)
            let array = [...state.postUploaderProfilePic, { userId, profilePic }]
            let uniqueArray = Array.from(new Map(array.map(obj => [obj.userId, obj])).values());
            state.postUploaderProfilePic = uniqueArray
        }
    }

})

export const { getInitialPost, getpostUploaderProfilePic } = postSlice.actions;
export default postSlice.reducer