import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    initialPosts: []
}

const postSlice = createSlice({
    name: 'postsSlice',
    initialState,
    reducers: {
        getInitialPost: (state, action) => {
            let array = [...state.initialPosts, ...action.payload.initialPosts]
            // console.log(array)
            // console.log(state.initialPosts)
            // console.log(action.payload.initialPosts)
            let uniqueArray = Array.from(new Map(array.map(obj => [obj.$id, obj])).values());
            state.initialPosts = uniqueArray
        }
    }

})

export const { getInitialPost } = postSlice.actions;
export default postSlice.reducer