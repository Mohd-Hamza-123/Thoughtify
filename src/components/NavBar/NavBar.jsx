import React from "react";
import { Outlet } from "react-router-dom";
import { UpperNavigationBar, LowerNavigationBar, SideBar } from "../";

const NavBar = () => {

  return (
    <div className="overflow-y-scroll overflow-x-hidden">
      <header className="z-5 relative flex flex-col gap-3">
        <UpperNavigationBar />
        <LowerNavigationBar />
      </header>
      <SideBar />
      <Outlet />
    </div>
  );
};

export default NavBar;
