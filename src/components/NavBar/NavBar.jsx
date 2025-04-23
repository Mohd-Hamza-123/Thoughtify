import React from "react";
import { UpperNavigationBar, LowerNavigationBar } from "../";
import { useLocation } from "react-router-dom";
const NavBar = () => {
  const location = useLocation();
  // console.log(location)

  const hide = location.pathname === "/login" || location.pathname === "/signup";

  if (hide) return null

  return (
    <header className="z-30 relative h-[20dvh] overflow-hidden flex flex-col gap-3">
      <UpperNavigationBar />
      <LowerNavigationBar />
    </header>
  );
};

export default NavBar;
