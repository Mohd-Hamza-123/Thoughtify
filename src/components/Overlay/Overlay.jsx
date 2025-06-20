import "./Overlay.css";
import React from "react";
import { useAskContext } from "../../context/AskContext";

const Overlay = () => {
  const {
    setIsOpen,
    SetSettingPopUp,
    isOverlayBoolean,
    setisOverlayBoolean,
  } = useAskContext();

  const closeOverlay = () => {
    setIsOpen(false);
    setisOverlayBoolean(false)
    SetSettingPopUp(false)
  };

  return (
    <div
      onClick={closeOverlay}
      id="Overlay"
      className={`${isOverlayBoolean ? "active" : ""}`}
    ></div>
  );
};

export default Overlay;
