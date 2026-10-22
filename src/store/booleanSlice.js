import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isFeedbackOpen: false,
    isOverlayVisible: false,
    isSidebarVisible: false,
    isSettingOpen: false,
    isAppInstalled: true,
}

const booleanSlice = createSlice({
    name: "booleanSlice",
    initialState,
    reducers: {
        feedbackToggle: (state) => {
            state.isFeedbackOpen = !state.isFeedbackOpen
        },
        setIsOverlayVisible: (state, action) => {
            state.isOverlayVisible = action.payload;
        },
        setIsSidebarVisible: (state, action) => {
            state.isSidebarVisible = action.payload;
        },
        setIsSettingOpen: (state, action) => {
            state.isSettingOpen = action.payload;
        },
        toggleSidebar: (state) => {
            state.isSidebarVisible = !state.isSidebarVisible;
        },
        toggleSetting: (state) => {
            state.isSettingOpen = !state.isSettingOpen;
        },
    }
})

export const { 
    feedbackToggle,
    setIsOverlayVisible,
    setIsSidebarVisible,
    setIsSettingOpen,
    toggleSidebar,
} = booleanSlice.actions;

export default booleanSlice.reducer;