import "../../index.css";
import "./UpperNavigationBar.css";
import React from "react";
import { useNavigate } from "react-router-dom";

import {
  Logo,
  UserCircle,
  UpperNavigationBarNotification,
  UpperNavigationBarSearch,
  UpperNavigationBarBtns,
} from "..";

import { useAskContext } from "../../context/AskContext";
import { useSelector } from "react-redux/es/hooks/useSelector";

const NavigationBar = () => {
  const authStatus = useSelector((state) => state.auth.status);

  const { setIsOpen, myUserProfile, setisOverlayBoolean } = useAskContext();

  const toggleSideBar = () => {
    setIsOpen(true);
    setisOverlayBoolean(true);
  };

  return (
    <nav
      id={"nav"}
      className="w-screen relative z-10 flex flex-col md:flex-row justify-between items-center px-4 py-2 shadow-md transition-all"
    >
      <Logo />

      <div className="UpperNavigationBar_Nav_Right_Items">
        <UpperNavigationBarSearch />
        <UpperNavigationBarNotification />
        {authStatus && myUserProfile && (
          <div id="upperNavbar_svg_div" onClick={toggleSideBar}>
            <UserCircle />
          </div>
        )}
        <UpperNavigationBarBtns />
      </div>
    </nav>
  );
};

export default NavigationBar;
