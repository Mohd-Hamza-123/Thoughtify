import { configureStore } from "@reduxjs/toolkit";
import authSlice from './authSlice'
import profileSlice from "./profileSlice";
import viewPostsSlice from "./ViewPostsSlice";

const store = configureStore({
    reducer: {
        auth: authSlice,
        profileSlice: profileSlice,
        viewPostsSlice,
    }
})

export default store;