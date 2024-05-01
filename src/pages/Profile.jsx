import React from "react";
import { UpperNavigationBar, MyProfile } from "../components/index";
import './Profile.css'
const Profile = () => {
  return (
    <div className="Profile">
        <UpperNavigationBar />
        <MyProfile />
    </div>
  );
};

export default Profile;
