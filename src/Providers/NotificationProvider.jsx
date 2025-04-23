import React, { useState } from 'react'
import { NotificationProvider as NP } from "@/context/NotificationContext";

const NotificationProviders = ({ children }) => {
    const [notification, setNotification] = useState({
        message: "",
        type: "success",
    })
    return (
        <NP
            value={{
                notification,
                setNotification,
            }}
        >
            {children}
        </NP>
    )
}

export default NotificationProviders