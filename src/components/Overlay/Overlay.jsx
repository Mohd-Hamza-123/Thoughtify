import "./Overlay.css";
import React from "react";
import { useSelector, useDispatch } from 'react-redux'
import { setIsOverlayVisible, setIsSidebarVisible } from "@/store/booleanSlice";

const Overlay = () => {

  const dispatch = useDispatch()
  const isOverlayVisible = useSelector((state) => state.booleanSlice.isOverlayVisible)

  const closeOverlay = () => {
    dispatch(setIsOverlayVisible(false))
    dispatch(setIsSidebarVisible(false))
  };

  return (
    <div
      onClick={closeOverlay}
      id="Overlay"
      className={`${isOverlayVisible ? "active" : ""}`}
    ></div>
  );
};

export default Overlay;
