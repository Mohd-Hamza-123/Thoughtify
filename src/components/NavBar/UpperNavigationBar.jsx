import "../../index.css";
import React from "react";
import "./UpperNavigationBar.css";
import { ProfileImage } from "../Logo";
import { useAskContext } from "../../context/AskContext";
import { useSelector } from "react-redux/es/hooks/useSelector";
import {
  Logo,
  UpperNavigationBarNotification,
  UpperNavigationBarSearch,
  UpperNavigationBarBtns,
} from "..";
import { useBooleanContext } from "@/context/BooleanContext";

const NavigationBar = () => {
  const { setIsOpen } = useAskContext();
  const { setIsOverlayVisible } = useBooleanContext();
  const authStatus = useSelector((state) => state.auth.status);

  const toggleSideBar = () => {
    setIsOverlayVisible(true);
    setIsOpen(true);
  };

  return (
    <nav className="w-full relative flex flex-col md:flex-row justify-between items-center p-1 md:px-4 shadow-md transition-all gap-1">
      <Logo />
      <div className="flex items-center gap-2 md:gap-4 justify-between md:justify-end w-full md:w-[50%] lg:w-[40%]">
        <UpperNavigationBarSearch />
        <UpperNavigationBarNotification />
        {authStatus && <ProfileImage onClick={toggleSideBar} />}
        <UpperNavigationBarBtns />
      </div>
    </nav>
  );
};

export default NavigationBar;
