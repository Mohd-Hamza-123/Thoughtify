import React from "react";
import "./Overlay.css";
import { useAskContext } from "../../context/AskContext";
const Overlay = ({ booleanOverlay = false }) => {
  const { isOpen, setIsOpen } = useAskContext();

  return (
    <div
      onClick={() => {
        setIsOpen(false);
      }}
      id="Overlay"
      className={`${isOpen ? "active" : ""} ${booleanOverlay ? "active" : ""}`}
    ></div>
  );
};

export default Overlay;
