import React from "react";
import { Outlet } from "react-router-dom";
import { UpperNavigationBar, LowerNavigationBar, SideBar } from "../";

const NavBar = () => {

  return (
    <>
      <header className="z-5 relative flex flex-col gap-3 overflow-hidden">
        <UpperNavigationBar />
        <LowerNavigationBar />
      </header>
      <SideBar />
      <Outlet />
    </>
  );
};

export default NavBar;
