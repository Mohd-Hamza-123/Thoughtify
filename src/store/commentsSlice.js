import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    comments: [],
    isMerge: true
}

const commentsSlice = createSlice({
    name: "commentsSlice",
    initialState,
    reducers: {
        getCommentsInRedux: (state, action) => {
            // console.log(action.payload.isMerge)
            let array = []
            if (action.payload.isMerge) {
                // console.log(" merge")
                array = [...state.comments, ...action.payload.comments]
            } else if (action.payload.isMerge === null) {
                array = [...action.payload.comments, ...state.comments]
            } else {
                // console.log("Do not merge")
                array = [...action.payload.comments]
            }
            let uniqueArray = Array.from(new Map(array.map(obj => [obj.$id
                , obj])).values());

            state.comments = uniqueArray
        },
    }
})

export const { getCommentsInRedux } = commentsSlice.actions;
export default commentsSlice.reducer;
