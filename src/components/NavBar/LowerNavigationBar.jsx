import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./LowerNavigationBar.css";
import { useAskContext } from "../../context/AskContext";
import AskQue from "../AskQue/AskQue";
import "./LowerNavigationBar.css";
const LowerNavigationBar = () => {
  const { setisAskQueVisible, isAskQueVisible, isOpen } = useAskContext();
  const navigate = useNavigate();
  const askQue = () => {
    setisAskQueVisible((prev) => !prev);
  };

  return (
    <>
      <nav
        id="LowerNavigationBar"
        className={`lower_Nav flex ${isOpen ? "lightdark" : ""}`}
      >
        <ul className="flex justify-around w-full">
          <li
            className="item "
            onClick={() => {
              navigate("/");
            }}
          >
            Home
          </li>
          <li className="item ">Find Friends</li>
          <li className="askQue " onClick={askQue}>
            Ask Question
          </li>
          <li className="item ">Category</li>
          <li className="item ">Browse Question</li>
          <li className="item ">Popular</li>
        </ul>
      </nav>
    </>
  );
};

export default LowerNavigationBar;
