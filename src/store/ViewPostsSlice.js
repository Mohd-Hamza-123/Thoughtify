import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    questions: [],
    RecentQuestions: [],
    commentCount: 0,
}

const viewPostsSlice = createSlice({
    name: 'viewPostsSlice',
    initialState,
    reducers: {
        getAllVisitedQuestionsInViewPost: (state, action) => {
            let array = [...state.questions, action.payload.questions]
            // console.log(array)
            let uniqueArray = Array.from(new Map(array.map(obj => [obj?.$id, obj])).values());
            state.questions = uniqueArray

        }
    }

})

export const { getAllVisitedQuestionsInViewPost } = viewPostsSlice.actions;
export default viewPostsSlice.reducer