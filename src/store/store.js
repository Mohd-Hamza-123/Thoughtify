import { configureStore } from "@reduxjs/toolkit";
import authSlice from './authSlice'
import profileSlice from "./profileSlice";
import postsSlice from "./postsSlice";
const store = configureStore({
    reducer: {
        auth: authSlice,
        profileSlice: profileSlice,
        postsSlice  : postsSlice,
    }
})

export default store;