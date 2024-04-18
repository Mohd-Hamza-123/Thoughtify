import React from "react";
import "./Overlay.css";
import { useAskContext } from "../../context/AskContext";
const Overlay = () => {
  const { setIsOpen, isOverlayBoolean, setisOverlayBoolean, SetSettingPopUp } = useAskContext();

  return (
    <div
      onClick={() => {
        setIsOpen(false);
        setisOverlayBoolean(false)
        SetSettingPopUp(false)
      }}
      id="Overlay"
      className={`${isOverlayBoolean ? "active" : ""}`}
    ></div>
  );
};

export default Overlay;
