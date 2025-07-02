import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    homePageLoading : true,
}

const loadingSlice = createSlice({
    name: "loadingSlice",
    initialState,
    reducers: {
        homePageLoading : (state, action) => {
            state.homePageLoading = false
        }
    }
})

export const { homePageLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
