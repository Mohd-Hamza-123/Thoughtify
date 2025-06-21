import React from "react";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAskContext } from "@/context/AskContext";

export default function UpperNavigationBarBtns() {

  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.status);

  const { myUserProfile } = useAskContext();
  const navbarBtn = [
    {
      name: "Login",
      active: !authStatus,
      slug: "/login",
    },
    {
      name: "Sign-In",
      active: !authStatus,
      slug: "/signup",
    },
  ];


  return (
    <ul className={`${authStatus ? "hidden" : ""} flex items-center gap-2`}>
      {navbarBtn.map((Item) =>
        Item.active ? (
          <li key={Item?.name}>
            <button
              // variant="default"
              className="md:px-5 px-3 py-1 md:py-2 duration-200 rounded-full md:rounded-full bg-[#16BEF6] hover:bg-[#17A3E8] text-sm text-white"
              onClick={() => navigate(Item?.slug)}>
              {Item?.name}
            </button>
          </li>
        ) : null
      )}
    </ul>
  )
}
