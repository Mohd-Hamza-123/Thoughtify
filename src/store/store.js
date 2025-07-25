import { configureStore } from "@reduxjs/toolkit";
import authSlice from './authSlice'
import profileSlice from "./profileSlice";
import postsSlice from "./postsSlice";
import queriesSlice from './queries'
import viewPostsSlice from "./ViewPostsSlice";
import commentsSlice from "./commentsSlice";

const store = configureStore({
    reducer: {
        auth: authSlice,
        profileSlice: profileSlice,
        postsSlice  : postsSlice,
        queriesSlice,
        viewPostsSlice,
        commentsSlice
    }
})

export default store;