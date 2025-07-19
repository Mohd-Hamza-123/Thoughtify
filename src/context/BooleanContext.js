import { createContext, useContext } from "react";

export const BooleanContext = createContext({});

export const useBooleanContext = () => {
    return useContext(BooleanContext)
}

export const BooleanProvider = BooleanContext.Provider;

