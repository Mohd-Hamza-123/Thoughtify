import authSlice from './authSlice'
import profileSlice from "./profileSlice";
import loadingSlice from './loadingSlice'
import booleanSlice from "./booleanSlice"
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
    reducer: {
        auth: authSlice,
        profileSlice: profileSlice,
        loadingSlice,
        booleanSlice
    }
})

export default store;