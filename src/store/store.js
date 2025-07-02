import { configureStore } from "@reduxjs/toolkit";
import authSlice from './authSlice'
import profileSlice from "./profileSlice";
import viewPostsSlice from "./ViewPostsSlice";
import loadingSlice from './loadingSlice'
const store = configureStore({
    reducer: {
        auth: authSlice,
        profileSlice: profileSlice,
        viewPostsSlice,
        loadingSlice,
    }
})

export default store;