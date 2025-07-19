import "./Overlay.css";
import React from "react";
import { useAskContext } from "../../context/AskContext";
import { useBooleanContext } from "@/context/BooleanContext";


const Overlay = () => {
  const {
    setIsOpen,
    SetSettingPopUp,
  } = useAskContext();
  const { isOverlayVisible, setIsOverlayVisible } = useBooleanContext();

  const closeOverlay = () => {
    setIsOpen(false);
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
