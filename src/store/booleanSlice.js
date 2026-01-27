import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isFeedbackOpen : false,
}


const booleanSlice = createSlice({
    name: "booleanSlice",
    initialState,
    reducers: {
        feedbackToggle : (state)=> {
            state.isFeedbackOpen = !state.isFeedbackOpen
        }
    }
})

export const { feedbackToggle } = booleanSlice.actions;
export default booleanSlice.reducer;