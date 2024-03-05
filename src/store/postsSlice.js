import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    initialPosts: null
}

const postSlice = createSlice({
    name: 'postsSlice',
    initialState,
    reducers: {
        getInitialPost: (state, action) => {
            // console.log(action.payload.initialPosts)
            state.initialPosts = action.payload.initialPosts
        }
    }

})

export const { getInitialPost } = postSlice.actions;
export default postSlice.reducer