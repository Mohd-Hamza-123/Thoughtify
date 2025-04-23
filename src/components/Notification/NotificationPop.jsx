import './NotificationPop.css'
import React, { useEffect } from 'react'
import { useNotificationContext } from '../../context/NotificationContext'
import { BiSolidError } from "react-icons/bi";
import { FaCircleCheck } from "react-icons/fa6";
import { RxCross1 } from "react-icons/rx";


const NotificationPop = () => {
    const { notification, setNotification } = useNotificationContext()

    useEffect(() => {
        if (notification?.message !== '') {
            setTimeout(() => {
                setNotification({ message: '', type: '' })
            }, 5000)
        }
    }, [notification])


    const setStyle = (type) => {
        if (type === "success") {
            return "green"
        } else if (type === "error") {
            return "red"
        }
    }

    const closeNotification = () => {
        setNotification({ message: '', type: '' })
    }

    return (
        <div id='NotificationPop' className={`${notification?.message ? 'active' : ''}`}>
            <section className={`${setStyle(notification?.type)} flex justify-between items-center`}>
                {notification?.type === "error" && <BiSolidError className='text-xl fill-white' />}
                {notification?.type === "success" && <FaCircleCheck className='text-xl fill-white' />}
            </section>
            <section>
                <p>{notification?.message}</p>
                <RxCross1 onClick={closeNotification} />
            </section>
        </div>
    )
}

export default NotificationPop