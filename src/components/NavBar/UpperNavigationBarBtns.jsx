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
    (!authStatus || !myUserProfile) && (
      <ul className="flex items-center gap-2">
        {navbarBtn.map((Item) =>
          Item.active ? (
            <li key={Item?.name}>
              <Button
                variant="default"
                className="inline-bock md:px-6 px-4 md:py-2 py-1 duration-200 rounded-full bg-[#16BEF6] hover:bg-[#17A3E8]"
                onClick={() => navigate(Item?.slug)}
              >
                {Item?.name}
              </Button>
            </li>
          ) : null
        )}
      </ul>
    )
  );
}
