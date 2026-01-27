import { configureStore } from "@reduxjs/toolkit";
import authSlice from './authSlice'
import profileSlice from "./profileSlice";
import viewPostsSlice from "./ViewPostsSlice";
import loadingSlice from './loadingSlice'
import booleanSlice from "./booleanSlice"
const store = configureStore({
    reducer: {
        auth: authSlice,
        profileSlice: profileSlice,
        viewPostsSlice,
        loadingSlice,
        booleanSlice
    }
})

export default store;