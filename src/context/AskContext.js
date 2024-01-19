import { createContext, useContext } from "react";

export const AskContext = createContext({});

export const useAskContext = () => {
    return useContext(AskContext)
}

export const AskProvider = AskContext.Provider;