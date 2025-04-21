import React from "react";
import { UpperNavigationBar, LowerNavigationBar } from "../";

const NavBar = () => {
  return (
    <header className="z-30 relative h-[20dvh] overflow-hidden flex flex-col gap-3">
      <UpperNavigationBar />
      <LowerNavigationBar />
    </header>
  );
};

export default NavBar;
