import React, { useState, useEffect } from 'react'
import './HomeRight.css'
import { categoriesArr } from '../AskQue/Category'
import { useNavigate } from 'react-router-dom'
import { useAskContext } from '../../context/AskContext'
import { useSelector } from 'react-redux'
import authService from '../../appwrite/auth'
const HomeRight = () => {
    const userData = useSelector((state) => state.auth.userData)
    // console.log(userData)
    const [isEmailVerified, setisEmailVerified] = useState(userData?.emailVerification || false
    );
    const { feedbackPopUp, setfeedbackPopUp } = useAskContext()
    const userAuthStatus = useSelector((state) => state.auth.status)
    const navigate = useNavigate();

    const verifyEmail = async () => {
        const getVerificationDetails = await authService.emailVerification();
        // console.log(getVerificationDetails)
        console.log("email verification sent")
    }
   
    return (
        <>
            <div className='HomeRight_Category mb-4'>
                <p>Search What Suits You</p>
                <div className='flex flex-wrap gap-y-2 gap-x-3'>
                    {categoriesArr?.map((category, index) => (
                        <span onClick={() => navigate(`/BrowseQuestion/${category.category}/${null}`)} className='cursor-pointer' key={category.category}>{category.category}</span>
                    ))}
                </div>
            </div>
            <hr />
            <div className='flex flex-wrap gap-x-3 gap-y-2 HomeRight_Privacy'>
                {userAuthStatus && <span className='cursor-pointer' onClick={() => setfeedbackPopUp((prev) => !prev)}>Feedback</span>}
                <span >About Creater</span>
                <span className='cursor-pointer' onClick={() => navigate(`/trustedResponders`)}>Trusted Responders</span>
                {(!isEmailVerified && userAuthStatus) && <span onClick={verifyEmail}
                    className='cursor-pointer'>Verify Your Email</span>}
            </div>
        </>
    )
}

export default HomeRight