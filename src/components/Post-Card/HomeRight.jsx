import './HomeRight.css'
import { toast } from "sonner"
import authService from '../../appwrite/auth'
import { useNavigate } from 'react-router-dom'
import { categoryArr } from '../AskQue/Category'
import React, { useState, useEffect } from 'react'
import { feedbackToggle } from '@/store/booleanSlice'
import { useSelector, useDispatch } from 'react-redux'
import { useBooleanContext } from '@/context/BooleanContext'

const HomeRight = ({ switchTrigger }) => {

    const navigate = useNavigate();
    const dispatch = useDispatch()
    const userStatus = useSelector((state) => state.auth.status)
    const userData = useSelector((state) => state.auth.userData)
   
    const [isEmailVerified, setIsEmailVerified] = useState(userData?.emailVerification || false);

    const { setIsSettingOpen, setIsOverlayVisible } = useBooleanContext()

    useEffect(() => {
        if (userData) setIsEmailVerified(userData?.emailVerification || false)
    }, [userData])

    const verifyEmail = async () => {
        try {
            const getVerificationDetails = await authService.emailVerification();

            if (getVerificationDetails) {

                toast.success("Message sent! Check your G-mail inbox to verify")

            } else {

                toast.error("Verification Failed. Try again later")
            }

        } catch (error) {

            toast.error("Verification Failed. Try again later")
            console.log(error instanceof Error ? error.message : error)
        }

    }
    const feedbackPopUp = () => dispatch(feedbackToggle())

    const settingPopUp = () => {
        if (!userStatus) {
            toast.error("You are not login")
            return
        }
        setIsSettingOpen((prev) => !prev)
        setIsOverlayVisible((prev) => !prev)
    }

    return (
        <section className={`h-fit w-full md:w-[35%] sticky top-0 ${switchTrigger === false ? "block" : "hidden"} md:block`}>
            <div className={`HomeRight_Category my-4`}>
                <p>Search What Suits You</p>
                <div className='flex flex-wrap gap-y-2 gap-x-3'>
                    {categoryArr?.map((category) => (
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
                {userStatus && <span className="cursor-pointer" onClick={feedbackPopUp}>Feedback</span>}
                <span onClick={settingPopUp} className='cursor-pointer'>Setting</span>
                {(!isEmailVerified && userStatus) && <span onClick={verifyEmail} className="cursor-pointer">Verify Your Email</span>}
            </div>
        </section>
    )
}

export default HomeRight