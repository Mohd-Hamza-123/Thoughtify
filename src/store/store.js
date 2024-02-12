import { configureStore } from "@reduxjs/toolkit";
import authSlice from './authSlice'
import profileSlice from "./profileSlice";
const store = configureStore({
    reducer: {
        auth: authSlice,
        profileSlice : profileSlice,
    }
})

export default store;