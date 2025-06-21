import React, { useState, useEffect } from 'react'
import './HomeRight.css'
import { categoriesArr } from '../AskQue/Category'
import { useNavigate } from 'react-router-dom'
import { useAskContext } from '../../context/AskContext'
import { useSelector } from 'react-redux'
import authService from '../../appwrite/auth'


const HomeRight = () => {
    const userData = useSelector((state) => state.auth.userData)

    const [isEmailVerified, setisEmailVerified] = useState(userData?.emailVerification || false
    );
    const {
        setfeedbackPopUp,
        SetSettingPopUp,
        setisOverlayBoolean,
        isDarkModeOn,
        setNotificationPopMsgNature,
        setnotificationPopMsg
    } = useAskContext()
    const userAuthStatus = useSelector((state) => state.auth.status)
    const navigate = useNavigate();

    useEffect(() => {
        if (userData) {
            setisEmailVerified((prev) => userData?.emailVerification || false)
        }
    }, [userData])


    const verifyEmail = async () => {
        try {
            const getVerificationDetails = await authService.emailVerification();

            if (getVerificationDetails) {
                setNotificationPopMsgNature((prev) => true);
                setnotificationPopMsg((prev) => `Message sent! Check your G-mail inbox to verify`);
            } else {
                setNotificationPopMsgNature((prev) => false);
                setnotificationPopMsg((prev) => `Verification Failed. Try again later`);
            }
            setNotificationPopMsgNature((prev) => true);
            setnotificationPopMsg((prev) => `Message sent! Check your G-mail inbox to verify`);
        } catch (error) {
            setNotificationPopMsgNature((prev) => false);
            setnotificationPopMsg((prev) => `Verification Failed. Try again later`);
        }

    }

    return (
        <section className='w-full md:w-[35%] hidden md:block'>
            <div className={`HomeRight_Category my-4 ${isDarkModeOn ? "darkMode" : ''}`}>
                <p className={`${isDarkModeOn ? "text-white" : ''}`}>Search What Suits You</p>
                <div className='flex flex-wrap gap-y-2 gap-x-3'>
                    {categoriesArr?.map((category, index) => (
                        <span onClick={() => navigate(`/BrowseQuestion/${category?.category}/${null}`)} className='cursor-pointer' key={category?.category}>{category.category}</span>
                    ))}
                </div>
            </div>
            <hr />
            <div className='flex flex-wrap gap-x-3 gap-y-2 HomeRight_Privacy'>
                {userAuthStatus && <span className={`cursor-pointer ${isDarkModeOn ? "text-white" : ''}`} onClick={() => {
                    if (!userAuthStatus) {
                        setNotificationPopMsgNature((prev) => false);
                        setnotificationPopMsg((prev) => 'You are not Login');
                        return
                    }
                    setfeedbackPopUp((prev) => !prev)
                }}>Feedback</span>}
                <span className={`cursor-pointer ${isDarkModeOn ? "text-white" : ''}`} onClick={() => {
                    if (!userAuthStatus) {
                        setNotificationPopMsgNature((prev) => false);
                        setnotificationPopMsg((prev) => 'You are not Login');
                        return
                    }
                    SetSettingPopUp((prev) => !prev)
                    setisOverlayBoolean((prev) => !prev)
                }
                }>Setting</span>
                <span className={`cursor-pointer ${isDarkModeOn ? "text-white" : ''}`} onClick={() => {
                    if (!userAuthStatus) {
                        setNotificationPopMsgNature((prev) => false);
                        setnotificationPopMsg((prev) => 'You are not Login');
                        return
                    }
                    navigate(`/trustedResponders`);
                }}>Trusted Responders</span>
                {(!isEmailVerified && userAuthStatus) && <span onClick={verifyEmail}
                    className={`cursor-pointer ${isDarkModeOn ? "text-white" : ''}`}>Verify Your Email</span>}
            </div>
        </section>
    )
}

export default HomeRight