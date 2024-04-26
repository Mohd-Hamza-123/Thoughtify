import React from "react";
import { NavLink } from "react-router-dom";
import "./LowerNavigationBar.css";
import { useAskContext } from "../../context/AskContext";
import "./LowerNavigationBar.css";
import { useSelector } from 'react-redux'

const LowerNavigationBar = () => {

  
  const { isOpen, isDarkModeOn } = useAskContext();

  const arr = [
    {
      NavName: "Home",
      slug: '/'
    },
    {
      NavName: 'Responders Section',
      slug: "/Responders-Section"
    },
    {
      NavName: "Find People",
      slug: '/Find-People'
    },
    {
      NavName: "Got a Question",
      slug: `/AskQuestion`
    },
    {
      NavName: "Browse Question",
      slug: `/BrowseQuestion/${null}/${null}`
    },
  ]
  return (
    <>
      <nav
        id="LowerNavigationBar"
        className={`${isOpen ? "lightdark" : ""} ${isDarkModeOn ? "darkMode" : ""}`}
      >
        <ul>
          {arr?.map((nav) => (
            <NavLink key={nav.NavName} to={nav.slug} className={({ isActive }) => `${isActive ? 'active' : ''}`}>
              <li className="LowerNavigationBar_Navlinks">
                {nav.NavName}
              </li>
            </NavLink>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default LowerNavigationBar;
