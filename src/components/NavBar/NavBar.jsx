import React from "react";
import { UpperNavigationBar, LowerNavigationBar } from "../";

const NavBar = () => {
  return (
    <header className="z-30 relative">
      <UpperNavigationBar />
      <LowerNavigationBar />
    </header>
  );
};

export default NavBar;
