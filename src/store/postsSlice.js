import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    initialPosts: [],
    initialResponderPosts: [],
    initialPostsFlag: false,
    postUploaderProfilePic: [],

}

const postSlice = createSlice({
    name: 'postsSlice',
    initialState,
    reducers: {
        getInitialPost: (state, action) => {
            let array = []

            if (action.payload.initialPostsFlag) {
           
                array = [...action.payload.initialPosts, ...state.initialPosts]

                let uniqueArray = []
                let idSet = new Set();


                for (let obj of array) {
                    if (!idSet.has(obj?.$id)) {
                        idSet.add(obj?.$id);
                        uniqueArray.push(obj);
                    }
                }

                state.initialPosts = uniqueArray

            } else if (action.payload.initialPostsFlag === false) {
                array = [...action.payload.initialPosts]


                let uniqueArray = Array.from(new Map(array.map(obj => [obj.$id, obj])).values());
                state.initialPosts = uniqueArray

            } else {
          
                array = [...state.initialPosts, ...action.payload.initialPosts]

                let uniqueArray = Array.from(new Map(array.map(obj => [obj?.$id, obj])).values());
                state.initialPosts = uniqueArray
            }

        },
        getResponderInitialPosts: (state, action) => {
            let array = [];
            if (action.payload.initialPostsFlag) {

                array = [...action.payload.initialResponderPosts, ...state.initialResponderPosts]

                let uniqueArray = []
                let idSet = new Set();


                for (let obj of array) {
                    if (!idSet.has(obj?.$id)) {
                        idSet.add(obj?.$id);
                        uniqueArray.push(obj);
                    }
                }

                state.initialResponderPosts = uniqueArray

            } else if (action.payload.initialPostsFlag === false) {
                console.log(action.payload.initialResponderPosts)
                array = [...action.payload.initialResponderPosts]


                let uniqueArray = Array.from(new Map(array.map(obj => [obj.$id, obj])).values());
                state.initialResponderPosts = uniqueArray

            } else {
           
                array = [...state.initialResponderPosts, ...action.payload.initialResponderPosts]

                let uniqueArray = Array.from(new Map(array.map(obj => [obj.$id, obj])).values());
                state.initialResponderPosts = uniqueArray
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

export const { getInitialPost, getpostUploaderProfilePic, getResponderInitialPosts } = postSlice.actions;
export default postSlice.reducer