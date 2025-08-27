import "./Overlay.css";
import React from "react";
import { useAskContext } from "../../context/AskContext";
import { useBooleanContext } from "@/context/BooleanContext";


const Overlay = () => {
  const {
    SetSettingPopUp,
  } = useAskContext();

  const { isOverlayVisible, setIsOverlayVisible,setIsSidebarVisible } = useBooleanContext();

  const closeOverlay = () => {
    setIsSidebarVisible(false);
    setIsOverlayVisible(false)
    SetSettingPopUp(false)
  };

  // console.log(isOverlayVisible)

  return (
    <div
      onClick={closeOverlay}
      id="Overlay"
      className={`${isOverlayVisible ? "active" : ""}`}
    ></div>
  );
};

export default Overlay;
