import { Loader } from '@/components';
import profile from '@/appwrite/profile';
import React, { useEffect } from 'react';
import authService from '@/appwrite/auth';
import useProfile from '@/hooks/useProfile';
import { login, logout } from '@/store/authSlice';
import { userProfile } from '@/store/profileSlice';
import { useDispatch, useSelector } from 'react-redux';
import { homePageLoading } from '@/store/loadingSlice';


const Initialization = ({ children }) => {

    const dispatch = useDispatch();
    const { createProfile } = useProfile()
    const loading = useSelector((state) => state.loadingSlice.homePageLoading)

    const getMyProfile = async (userData) => {

        try {
            let myProfile = await profile.listSingleProfile(userData.$id)

            if (!myProfile) {
                await createProfile({ userId: userData.$id, name: userData.name })
                return
            };

            dispatch(userProfile({ userProfile: myProfile }))
        } catch (error) {
            console.error("getMyProfile failed", error);
            throw error; 
        }

    }

    const loggedIn = async () => {

        try {
            const userData = await authService.getCurrentUser();
            if (!userData) {
                dispatch(homePageLoading({ homePageLoading: false }))
                return
            }

            dispatch(login({ userData }));
            await getMyProfile(userData)

        } catch (error) {
            console.error("Initialization.jsx : Error in loggedIn ", error)
            dispatch(logout())
        } finally {
            dispatch(homePageLoading({ homePageLoading: false }))
        }
    }

    useEffect(() => { loggedIn() }, [])

    return (loading ? <Loader /> : <>{children}</>)
}

export default Initialization