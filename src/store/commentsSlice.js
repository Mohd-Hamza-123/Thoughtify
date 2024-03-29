import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    comments: []
}

const commentsSlice = createSlice({
    name: "commentsSlice",
    initialState,
    reducers: {
        getCommentsInRedux: (state, action) => {
            let array = [...state.comments, ...action.payload.comments]
            let uniqueArray = Array.from(new Map(array.map(obj => [obj.$id
                , obj])).values());
        
            state.comments = uniqueArray
        },
    }
})

export const { getCommentsInRedux } = commentsSlice.actions;
export default commentsSlice.reducer;
