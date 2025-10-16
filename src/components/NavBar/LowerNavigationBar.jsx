import "./LowerNavigationBar.css";
import React, { useRef } from "react";
import { NavLink } from "react-router-dom";
import { useAskContext } from "../../context/AskContext";

const LowerNavigationBar = () => {

  const lowerNavBarRef = useRef();
  const { isOpen } = useAskContext();

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

    <nav
      ref={lowerNavBarRef}
      id="LowerNavigationBar"
      className={`${isOpen ? "lightdark" : ""}`}>
      {arr.map((nav) => (
        <NavLink
          onClick={() => {
            if (lowerNavBarRef.current) lowerNavBarRef.current.classList.remove("active");
          }}
          to={nav.slug}
          key={nav.NavName}
          className={({ isActive }) => `${isActive ? "active" : ""} relative`}>
          <li>{nav.NavName}</li>
          <div className="bg-white rounded-lg h-[2px] mx-auto absolute bottom-[2px] left-0 right-0"></div>
        </NavLink>
      ))}
    </nav>

  );
};

export default LowerNavigationBar;
