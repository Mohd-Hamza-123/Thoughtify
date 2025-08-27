import { Loader } from '@/components';
import profile from '@/appwrite/profile';
import { login } from '@/store/authSlice';
import authService from '@/appwrite/auth';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { userProfile } from '@/store/profileSlice';
import { useDispatch, useSelector } from 'react-redux';

const InitializationWrapper = ({ children }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const userStatus = useSelector((state) => state.auth.status)
    const userData = useSelector((state) => state.auth.userData)
    const myProfile = useSelector((state) => state.profileSlice.userProfile)
    
    const loggedIn = async () => {
        try {
            const userData = await authService.getCurrentUser();
            // console.log(userData);
            if (userData) {
                dispatch(login({ userData }));
                await getMyProfile(userData?.$id)
                navigate("/");
            } else {
                setLoading(false)
            }
        } catch (error) {
            setLoading(false)
        }
    }


    async function getMyProfile(profileID) {
        const myProfile = await profile.listSingleProfile(profileID)
        dispatch(userProfile({ userProfile: { ...myProfile } }))
        setLoading(false)
    }

    useEffect(() => { loggedIn() }, [userStatus])

    return (loading ? <Loader /> : <>{children}</>)
}

export default InitializationWrapper