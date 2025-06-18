import "../../index.css";
import React from "react";
import "./UpperNavigationBar.css";
import { useAskContext } from "../../context/AskContext";
import { useSelector } from "react-redux/es/hooks/useSelector";
import {
  Logo,
  UserCircle,
  UpperNavigationBarNotification,
  UpperNavigationBarSearch,
  UpperNavigationBarBtns,
} from "..";

const NavigationBar = () => {
  const authStatus = useSelector((state) => state.auth.status);
  const { setIsOpen, myUserProfile, setisOverlayBoolean } = useAskContext();

  const toggleSideBar = () => {
    setIsOpen(true);
    setisOverlayBoolean(true);
  };

  return (
    <nav
      className="w-full relative flex flex-col md:flex-row justify-between items-center px-4 py-2 shadow-md transition-all"
    >
      <Logo />

      <div className="UpperNavigationBar_Nav_Right_Items">
        <UpperNavigationBarSearch />
        <UpperNavigationBarNotification />
        {authStatus && (
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
