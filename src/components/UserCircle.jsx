import React from "react";
import { useAskContext } from "../context/AskContext";

const UserCircle = () => {
  const { myUserProfile } = useAskContext()
  return (
    <div id="upperNavbar_svg_div">
      <img src={myUserProfile?.profileImgURL} alt="" />
    </div>
  );
};

export default UserCircle;
