import "./LowerNavigationBar.css";
import React, { useRef } from "react";
import { Button } from "../ui/button";
import { NavLink } from "react-router-dom";
import { useAskContext } from "../../context/AskContext";

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
      NavName: "Got a Question",
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
        className={`${isOpen ? "lightdark" : ""} ${
          isDarkModeOn ? "darkMode" : ""
        }`}
      >
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
            <li className="LowerNavigationBar_Navlinks">{nav.NavName}</li>
          </NavLink>
        ))}
      </nav>
      <div className="LowerNavigationBar_Three_Bars_Div">
        <Button
          varient="default"
          onClick={() => {
            if (lowerNavBarRef.current) {
              lowerNavBarRef.current.classList.toggle("active");
            }
          }}
        >
          <i className={`fa-solid fa-bars`}></i>
        </Button>
      </div>
    </div>
  );
};

export default LowerNavigationBar;
