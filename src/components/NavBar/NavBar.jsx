import React from "react";
import { useLocation } from "react-router-dom";
import { UpperNavigationBar, LowerNavigationBar } from "../";
const NavBar = () => {
  const location = useLocation();
  const hide = location.pathname === "/login" || location.pathname === "/signup";
  if (hide) return null

  return (
    <header className="z-5 relative h-[15dvh] lg:h-[20dvh] flex flex-col gap-3 bg-white border border-red-500 overflow-hidden">
      <UpperNavigationBar />
      <LowerNavigationBar />
    </header>
  );
};

export default NavBar;
