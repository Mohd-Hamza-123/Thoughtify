import React, { useEffect } from 'react'
import './NotificationPop.css'
import { useAskContext } from '../../context/AskContext'
const NotificationPop = ({ notificationPopMsg, notificationPopMsgNature }) => {
    const { setnotificationPopMsg } = useAskContext()
    useEffect(() => {
        if (notificationPopMsg !== '') {
            setTimeout(() => {
                setnotificationPopMsg((prev) => "")
            }, 5000)
        }
    }, [notificationPopMsg])
    return (
        <div id='NotificationPop' className={`${notificationPopMsg ? 'active' : ''}`}>
            <section className={`${notificationPopMsgNature ? "green" : "red"}`}>
                {!notificationPopMsgNature && <i className="fa-solid fa-exclamation"></i>}
                {notificationPopMsgNature && <i className="fa-solid fa-check"></i>}
            </section>
            <section>
                <p>{notificationPopMsg}</p>
                <i onClick={() => {
                    setnotificationPopMsg((prev) => '')
                }} className="fa-solid fa-x"></i>
            </section>
        </div>
    )
}

export default NotificationPop