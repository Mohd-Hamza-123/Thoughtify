import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import authService from '@/appwrite/auth';
import { useDispatch } from 'react-redux';
import { login } from '@/store/authSlice';
import { Loader } from '@/components';

const InitializationWrapper = ({ children }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    
    const loggedIn = async () => {
        const userData = await authService.getCurrentUser();
        if (userData) {
            dispatch(login({ userData }));
            navigate("/");
            setLoading(false)
        } else {
            navigate("/login")
        }
    }

    useEffect(() => {
        loggedIn()
    }, [])

    return (loading ? <Loader /> : <>{children}</>)
}

export default InitializationWrapper