import { Loader } from '@/components';
import profile from '@/appwrite/profile';
import React, { useEffect } from 'react';
import authService from '@/appwrite/auth';
// import * as Sentry from "@/sentry/react"
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
        const myProfile = await profile.listSingleProfile(userData.$id)
        if (!myProfile) {
            const myProfile = await createProfile({ userId: userData.$id, name: userData.name })
            dispatch(userProfile({ userProfile: myProfile }))
            return
        };
        dispatch(userProfile({ userProfile: myProfile }))
    }

    const loggedIn = async () => {

        try {
            const userData = await authService.getCurrentUser();
            dispatch(login({ userData }));
            await getMyProfile(userData)
        } catch (error) {
            dispatch(logout())
            const message = error instanceof Error ? error.message : error
            if (import.meta.env.DEV) {
                console.error("Initialization.jsx : ", message);
            }
            // Sentry.captureException(error, {
            //     tags: {
            //         file: "Initialization.jsx",
            //         function: "getMyProfile",
            //     },
            //     extra: {
            //         userId: userData?.$id,
            //     },
            // });
        } finally {
            dispatch(homePageLoading({ homePageLoading: false }))
        }
    }

    useEffect(() => { loggedIn() }, [])

    return (loading ? <Loader /> : <>{children}</>)
}

export default Initialization