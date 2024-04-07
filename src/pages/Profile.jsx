import React from "react";
import { UpperNavigationBar, Container, MyProfile } from "../components/index";
import './Profile.css'
const Profile = () => {
  return (
    <div className="Profile">
      <Container>
        <UpperNavigationBar />
        <MyProfile />
      </Container>
    </div>
  );
};

export default Profile;
