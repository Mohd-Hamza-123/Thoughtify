import React, { useState } from "react";
import { BooleanProvider as BP } from "@/context/BooleanContext";

const BooleanProvider = ({ children }) => {
  const [isOverlayVisible, setIsOverlayVisible] = useState(false)
  return (
    <BP
      value={{
        isOverlayVisible,
        setIsOverlayVisible,
      }}
    >
      {children}
    </BP>
  )
}

export default BooleanProvider