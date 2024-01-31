import React from "react";
import { UpperNavigationBar, Container, MyProfile } from "../components/index";
import { Outlet } from "react-router-dom";
const Profile = () => {
  return (
    <div className="">
      <Container>
        <UpperNavigationBar />
        <MyProfile />
        {/* <Outlet /> */}
      </Container>
    </div>
  );
};

export default Profile;
