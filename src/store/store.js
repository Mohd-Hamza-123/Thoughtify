import { configureStore } from "@reduxjs/toolkit";
import authSlice from './authSlice'
import profileSlice from "./profileSlice";
import queriesSlice from './queries'
import viewPostsSlice from "./ViewPostsSlice";

const store = configureStore({
    reducer: {
        auth: authSlice,
        profileSlice: profileSlice,
        queriesSlice,
        viewPostsSlice,
    }
})

export default store;