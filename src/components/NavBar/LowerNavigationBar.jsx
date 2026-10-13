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
      NavName: "Responders",
      slug: "/responders-post",
    },
    {
      NavName: "Find People",
      slug: "/find-people",
    },
    {
      NavName: "Have a Query ?",
      slug: `/ask-question`,
    },
    {
      NavName: "Browse Question",
      slug: `/browse-question/${null}/${null}`,
    },
  ];

  return (

    <nav
      ref={lowerNavBarRef}
      id="LowerNavigationBar"
      className={`hidden md:flex bg-bluePrimary ${isOpen ? "lightdark" : ""}`}>
      {arr.map((nav) => (
        <NavLink
          onClick={() => {
            if (lowerNavBarRef.current) lowerNavBarRef.current.classList.remove("active");
          }}
          to={nav.slug}
          key={nav.NavName}
          className={({ isActive }) => `${isActive ? "active" : ""} relative`}>
          <li className="list-none">{nav.NavName}</li>
          <div className="bg-white rounded-lg h-[2px] mx-auto absolute bottom-[2px] left-0 right-0"></div>
        </NavLink>
      ))}
    </nav>

  );
};

export default LowerNavigationBar;
