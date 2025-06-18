import React from "react";
import NoProfile from "../assets/NoProfile.png";
import { useAskContext } from "../context/AskContext";

const UserCircle = ({ ...props }) => {
  const { myUserProfile } = useAskContext();
  return (
    <div {...props} id="upperNavbar_svg_div">
      <img
        src={myUserProfile?.profileImgURL}
        onError={(e) => e.target.src = NoProfile}
      />
    </div>
  );
};

export default UserCircle;
