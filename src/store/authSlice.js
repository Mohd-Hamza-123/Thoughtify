import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: false,
    userData: null,
    editProfileStatus: false
}


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.status = true
            state.userData = action.payload.userData
        },
        logout: (state) => {
            state.status = false
            state.userData = null;
        },
        editProfileVisible: (state, action) => {
            state.editProfileStatus = true
        },
        editProfileInVisible: (state) => {
            state.editProfileStatus = false
        }


    }
})

export const { logout, login, editProfileInVisible, editProfileVisible } = authSlice.actions;
export default authSlice.reducer;
