import "../../index.css";
import "./UpperNavigationBar.css";
import { Button } from "../ui/button";
import React from "react";
import { useNavigate } from "react-router-dom";

import {
  Logo,
  UserCircle,
  UpperNavigationBarNotification,
  UpperNavigationBarSearch,
} from "..";

import { useAskContext } from "../../context/AskContext";
import { useSelector } from "react-redux/es/hooks/useSelector";

const NavigationBar = () => {
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.status);

  const { setIsOpen, myUserProfile, setisOverlayBoolean } = useAskContext();

  const navbarBtn = [
    {
      name: "Login",
      active: !authStatus,
      slug: "/login",
    },
    {
      name: "Sign-In",
      active: !authStatus,
      slug: "/signup",
    },
  ];

  const toggleSideBar = () => {
    setIsOpen(true);
    setisOverlayBoolean(true);
  };

  return (
    <>
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
          {(!authStatus || !myUserProfile) && (
            <ul className="flex items-center gap-2">
              {navbarBtn.map((Item) =>
                Item.active ? (
                  <li key={Item?.name}>
                    <Button
                      variant="default"
                      className="inline-bock md:px-6 px-4 md:py-2 py-1 duration-200 rounded-full bg-[#16BEF6] hover:bg-[#17A3E8]"
                      onClick={() => navigate(Item?.slug)}
                    >
                      {Item?.name}
                    </Button>
                  </li>
                ) : null
              )}
            </ul>
          )}
        </div>
      </nav>
    </>
  );
};

export default NavigationBar;
