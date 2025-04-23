import { createContext, useContext } from "react";

export const NotificationContext = createContext({});

export const useNotificationContext = () => {
    return useContext(NotificationContext)
}

export const NotificationProvider = NotificationContext.Provider;

