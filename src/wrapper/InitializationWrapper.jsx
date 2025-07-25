import { Loader } from '@/components';
import { login } from '@/store/authSlice';
import authService from '@/appwrite/auth';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import profile from '@/appwrite/profile';
import { userProfile } from '@/store/profileSlice';

const InitializationWrapper = ({ children }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const userData = useSelector((state) => state.auth.userData)

    const loggedIn = async () => {
        const userData = await authService.getCurrentUser();
        if (userData) {
            dispatch(login({ userData }));
            getMyProfile(userData?.$id)
            navigate("/");
            setLoading(false)
        } else {
            setLoading(false)
            navigate("/login")
        }
    }

    async function getMyProfile(profileID) {
        const myProfile = await profile.listSingleProfile(profileID)
        dispatch(userProfile({ userProfile: { ...myProfile } }))
    }

    useEffect(() => { loggedIn() }, [])

    return (loading ? <Loader /> : <>{children}</>)
}

export default InitializationWrapper