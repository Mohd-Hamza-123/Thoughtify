import "./LowerNavigationBar.css";
import React, { useRef } from "react";
import { Button } from "../ui/button";
import { NavLink } from "react-router-dom";
import { useAskContext } from "../../context/AskContext";
import { Icons } from "..";

const LowerNavigationBar = () => {

  const lowerNavBarRef = useRef();
  const { isOpen, isDarkModeOn } = useAskContext();

  const arr = [
    {
      NavName: "Home",
      slug: "/",
    },
    {
      NavName: "Responders Section",
      slug: "/Responders-Section",
    },
    {
      NavName: "Find People",
      slug: "/Find-People",
    },
    {
      NavName: "Have a Query ?",
      slug: `/AskQuestion`,
    },
    {
      NavName: "Browse Question",
      slug: `/BrowseQuestion/${null}/${null}`,
    },
  ];

  return (
    <div className="relative">
      <nav
        ref={lowerNavBarRef}
        id="LowerNavigationBar"
        className={`${isOpen ? "lightdark" : ""} ${isDarkModeOn ? "darkMode" : ""
          }`}>
        {arr?.map((nav) => (
          <NavLink
            onClick={() => {
              if (lowerNavBarRef.current) {
                lowerNavBarRef.current.classList.remove("active");
              }
            }}
            key={nav.NavName}
            to={nav.slug}
            className={({ isActive }) => `${isActive ? "active" : ""}`}
          >
            <li>{nav.NavName}</li>
          </NavLink>
        ))}
      </nav>
     
    </div>
  );
};

export default LowerNavigationBar;
