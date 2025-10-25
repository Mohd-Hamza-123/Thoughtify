import './HomeRight.css'
import { useSelector } from 'react-redux'
import authService from '../../appwrite/auth'
import { useNavigate } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import { categoriesArr } from '../AskQue/Category'
import { useBooleanContext } from '@/context/BooleanContext'
import { useNotificationContext } from '@/context/NotificationContext'

const HomeRight = ({ switchTrigger }) => {

    const navigate = useNavigate();
    const userAuthStatus = useSelector((state) => state.auth.status)

    const userData = useSelector((state) => state.auth.userData)
    const [isEmailVerified, setisEmailVerified] = useState(userData?.emailVerification || false);

    const { setNotification } = useNotificationContext()
    const { setIsSettingOpen, isOverlayVisible, setIsOverlayVisible } = useBooleanContext()

    useEffect(() => {
        if (userData) setisEmailVerified(userData?.emailVerification || false)
    }, [userData])

    const verifyEmail = async () => {
        try {
            const getVerificationDetails = await authService.emailVerification();

            if (getVerificationDetails) {
                setNotification({ message: "Message sent! Check your G-mail inbox to verify", type: "success" })

            } else {
                setNotification({ message: "Verification Failed. Try again later", type: "error" })
            }

        } catch (error) {
            setNotification({ message: "Verification Failed. Try again later", type: "error" })
        }

    }
    const feedbackPopUp = () => {
        setNotification({ message: "Feedback", type: "success" })
        setfeedbackPopUp((prev) => !prev)
    }
    const settingPopUp = () => {
        if (!userAuthStatus) {
            setNotification({ message: "You are not Login", type: "error" })
            return
        }
        setIsSettingOpen((prev) => !prev)
        setIsOverlayVisible((prev) => !prev)
    }
    const trustedRespondersPopUp = () => {
        if (!userAuthStatus) {
            setNotification({ message: "You are not Login", type: "error" })
            return
        }
        navigate(`/trustedResponders`);
    }

    return (
        <section className={`h-fit w-full md:w-[35%] sticky top-0 ${switchTrigger === false ? "block" : "hidden"} md:block`}>
            <div className={`HomeRight_Category my-4`}>
                <p>Search What Suits You</p>
                <div className='flex flex-wrap gap-y-2 gap-x-3'>
                    {categoriesArr?.map((category) => (
                        <span
                            onClick={() => navigate(`/BrowseQuestion/${category?.category}/${null}`)}
                            className='cursor-pointer'
                            key={category?.category}>
                            {category.category}
                        </span>
                    ))}
                </div>
            </div>
            <hr />
            <div className='flex flex-wrap gap-x-3 gap-y-2 HomeRight_Privacy'>
                {userAuthStatus && <span className={`cursor-pointer`} onClick={feedbackPopUp}>Feedback</span>}
                <span onClick={settingPopUp} className='cursor-pointer'>Setting</span>
                <span className={`cursor-pointer`} onClick={trustedRespondersPopUp}>Trusted Responders</span>
                {(!isEmailVerified && userAuthStatus) && <span onClick={verifyEmail} className="cursor-pointer">Verify Your Email</span>}
            </div>
        </section>
    )
}

export default HomeRight