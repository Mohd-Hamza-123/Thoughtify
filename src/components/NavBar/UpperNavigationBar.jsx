import "../../index.css";
import React from "react";
import "./UpperNavigationBar.css";
import { useAskContext } from "../../context/AskContext";
import { useSelector } from "react-redux/es/hooks/useSelector";
import {
  Logo,
  UpperNavigationBarNotification,
  UpperNavigationBarSearch,
  UpperNavigationBarBtns,
} from "..";
import { ProfileImage } from "../Logo";

const NavigationBar = () => {
  const authStatus = useSelector((state) => state.auth.status);
  console.log(authStatus)
  const { setIsOpen, myUserProfile, setisOverlayBoolean } = useAskContext();

  const toggleSideBar = () => {
    setisOverlayBoolean(true);
    setIsOpen(true);
  };

  return (
    <nav
      className="w-full relative flex flex-col md:flex-row justify-between items-center px-4 py-2 shadow-md transition-all gap-2"
    >
      <Logo />

      <div className="flex items-center gap-2">
        <UpperNavigationBarSearch />
        <UpperNavigationBarNotification />
        {authStatus && (
          <ProfileImage onClick={toggleSideBar} />
        )}
        <UpperNavigationBarBtns />
      </div>
    </nav>
  );
};

export default NavigationBar;
