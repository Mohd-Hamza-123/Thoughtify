import React, { useState } from "react";
import { BooleanProvider as BP } from "@/context/BooleanContext";

const BooleanProvider = ({ children }) => {
  const [isOverlayVisible, setIsOverlayVisible] = useState(false)
  const [isSidebarVisible, setIsSidebarVisible] = useState(false)
  const [isSettingOpen, setIsSettingOpen] = useState(false)
  
  return (
    <BP
      value={{
        isOverlayVisible,
        setIsOverlayVisible,
        isSidebarVisible,
        setIsSidebarVisible,
        isSettingOpen,
        setIsSettingOpen
      }}
    >
      {children}
    </BP>
  )
}

export default BooleanProvider