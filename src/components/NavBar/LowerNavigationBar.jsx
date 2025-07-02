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
      {arr?.map((nav) => (
        <NavLink
          onClick={() => {
            if (lowerNavBarRef.current) lowerNavBarRef.current.classList.remove("active");
          }}
          key={nav.NavName}
          to={nav.slug}
          className={({ isActive }) => `${isActive ? "active" : ""}`}>
          <li>{nav.NavName}</li>
        </NavLink>
      ))}
    </nav>

  );
};

export default LowerNavigationBar;
