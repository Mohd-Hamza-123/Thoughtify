import React from "react";
import "./Overlay.css";
import { useAskContext } from "../../context/AskContext";
const Overlay = () => {
  const { isOpen, setIsOpen } = useAskContext();
//   console.log(isOpen);
  return (
    <div
      onClick={() => {
        setIsOpen(false);
      }}
      id="Overlay"
      className={`${isOpen ? "active" : ""}`}
    ></div>
  );
};

export default Overlay;
