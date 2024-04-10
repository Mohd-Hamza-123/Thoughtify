import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    initialPosts: [],
    initialPostsFlag: false,
    postUploaderProfilePic: [],
}

const postSlice = createSlice({
    name: 'postsSlice',
    initialState,
    reducers: {
        getInitialPost: (state, action) => {
            let array = []
            // let array = [...state.initialPosts, ...action.payload.initialPosts]
            if (action.payload.initialPostsFlag) {
                // console.log("true")
                array = [...action.payload.initialPosts, ...state.initialPosts]

                let uniqueArray = []
                let idSet = new Set();


                for (let obj of array) {
                    if (!idSet.has(obj.$id)) {
                        idSet.add(obj.$id);
                        uniqueArray.push(obj);
                    }
                }

                state.initialPosts = uniqueArray

            } else if (action.payload.initialPostsFlag === false) {
                console.log(action.payload.initialPosts)
                array = [...action.payload.initialPosts]


                let uniqueArray = Array.from(new Map(array.map(obj => [obj.$id, obj])).values());
                state.initialPosts = uniqueArray

            } else {
                // console.log("false")
                array = [...state.initialPosts, ...action.payload.initialPosts]

                let uniqueArray = Array.from(new Map(array.map(obj => [obj.$id, obj])).values());
                state.initialPosts = uniqueArray
            }

        },
        getpostUploaderProfilePic: (state, action) => {

            const { userId, profilePic } = action.payload;
            
            let array = [...state.postUploaderProfilePic, { userId, profilePic }]
            let uniqueArray = Array.from(new Map(array.map(obj => [obj.userId, obj])).values());
            state.postUploaderProfilePic = uniqueArray
        }
    }

})

export const { getInitialPost, getpostUploaderProfilePic } = postSlice.actions;
export default postSlice.reducer