import "../../index.css";
import React, { useEffect, useState } from "react";
import "./UpperNavigationBar.css";
import { useSelector } from "react-redux";
import { useBooleanContext } from "@/context/BooleanContext";
import {
  Logo,
  UpperNavigationBarBtns,
  UpperNavigationBarSearch,
  UpperNavigationBarNotification,
} from "..";
import { getAvatar } from "@/lib/avatar";

const NavigationBar = () => {

  const { setIsOverlayVisible, setIsSidebarVisible } = useBooleanContext();
  const authStatus = useSelector((state) => state.auth.status);
  const myProfile = useSelector((state) => state.profileSlice.userProfile); 
  const userdata = useSelector((state) => state.auth.userData);
  const [image, setImage] = useState("");

  
  const toggleSideBar = () => {
    setIsOverlayVisible(true);
    setIsSidebarVisible(true);
  };

  useEffect(() => {
    let profileImage = myProfile?.profileImage
      ? JSON.parse(myProfile?.profileImage)
      : undefined;

    let img = profileImage?.profileImageURL;
    if (img) {
      img = img.replace("/preview", "/view");
    } else {
      img = getAvatar(userdata?.name);
    }

    setImage(img);
  }, [myProfile]); 

  return (
    <nav className="w-full relative flex flex-col md:flex-row justify-between items-center p-1 md:px-4 shadow-md transition-all gap-1">
      <Logo />
      <div className="flex items-center gap-2 md:gap-4 justify-between md:justify-end w-full md:w-[50%] lg:w-[40%]">
        <UpperNavigationBarSearch />
        <UpperNavigationBarNotification />
        {authStatus && (
          <img
            onClick={toggleSideBar}
            src={image}
            alt="Profile Pic"
            className="w-[30px] md:w-[35px] h-[30px] md:h-[35px] rounded-full"
          />
        )}
        <UpperNavigationBarBtns />
      </div>
    </nav>
  );
};

export default NavigationBar;
