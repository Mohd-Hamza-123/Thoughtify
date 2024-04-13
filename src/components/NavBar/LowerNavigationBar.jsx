import React from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import "./LowerNavigationBar.css";
import { useAskContext } from "../../context/AskContext";
import AskQue from "../AskQue/AskQue";
import "./LowerNavigationBar.css";
import { useSelector } from 'react-redux'
const LowerNavigationBar = () => {
  const UserAuthStatus = useSelector((state) => state.auth.status)
  // console.log(UserAuthStatus)
  const { setisAskQueVisible, isAskQueVisible, isOpen } = useAskContext();
  const navigate = useNavigate();

  const arr = [
    {
      NavName: "Home",
      slug: '/'
    },
    {
      NavName: 'Responders Section',
      slug: '/'
    },
    {
      NavName: "Find People",
      slug: '/Find-People'
    },
    {
      NavName: "Got a Question",
      slug: `${UserAuthStatus ? '/AskQuestion' : '/'}`
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
        className={`lower_Nav flex ${isOpen ? "lightdark" : ""}`}
      >
        <ul className="flex justify-around w-full">
          {arr?.map((nav) => (
            <Link key={nav.NavName} to={nav.slug}>
              <li className="item">
                {nav.NavName}
              </li>
            </Link>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default LowerNavigationBar;
