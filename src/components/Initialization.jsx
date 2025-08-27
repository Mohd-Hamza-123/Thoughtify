import { Loader } from '@/components';
import React, { useEffect } from 'react';
import profile from '@/appwrite/profile';
import { login } from '@/store/authSlice';
import authService from '@/appwrite/auth';
import { useNavigate } from 'react-router-dom';
import { userProfile } from '@/store/profileSlice';
import { useDispatch, useSelector } from 'react-redux';
import { homePageLoading } from '@/store/loadingSlice';

const Initialization = ({ children }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userStatus = useSelector((state) => state.auth.status)
    const loading = useSelector((state) => state.loadingSlice.homePageLoading)

    const getMyProfile = async (profileID) => {
        const myProfile = await profile.listSingleProfile(profileID)
        dispatch(userProfile({ userProfile: { ...myProfile } }))
        dispatch(homePageLoading({ homePageLoading: false }))
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