import { Loader } from '@/components';
import profile from '@/appwrite/profile';
import React, { useEffect } from 'react';
import authService from '@/appwrite/auth';
import useProfile from '@/hooks/useProfile';
import { useNavigate } from 'react-router-dom';
import { login, logout } from '@/store/authSlice';
import { userProfile } from '@/store/profileSlice';
import { useDispatch, useSelector } from 'react-redux';
import { homePageLoading } from '@/store/loadingSlice';


const Initialization = ({ children }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { createProfile } = useProfile()
    const loading = useSelector((state) => state.loadingSlice.homePageLoading)

    const getMyProfile = async (profileID) => {

        try {
            const myProfile = await profile.listSingleProfile(profileID)
            if (myProfile) {
                dispatch(userProfile({ userProfile: { ...myProfile } }))
                dispatch(homePageLoading({ homePageLoading: false }))
            } else {
                const userData = await authService.getCurrentUser();
                await createProfile({ userId: userData?.$id, name: userData?.name })
                dispatch(homePageLoading({ homePageLoading: false }))
            }
        } catch (error) {
            dispatch(logout())
            dispatch(homePageLoading({ homePageLoading: false }))
            console.log("profile not found", error)
        }

    }

    const loggedIn = async () => {
        try {
            const userData = await authService.getCurrentUser();

            if (userData) {
                dispatch(login({ userData }));
                await getMyProfile(userData?.$id)
                navigate("/");
            } else {
                dispatch(homePageLoading({ homePageLoading: false }))
            }
        } catch (error) {
            dispatch(homePageLoading({ homePageLoading: false }))
        }
    }

    useEffect(() => {
        loggedIn()
    }, [])

    return (loading ? <Loader /> : <>{children}</>)
}

export default Initialization