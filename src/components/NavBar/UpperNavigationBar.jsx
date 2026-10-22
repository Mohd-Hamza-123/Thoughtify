import "../../index.css";
import "./UpperNavigationBar.css";
import { getAvatar } from "@/lib/avatar";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Logo,
  UpperNavigationBarBtns,
  UpperNavigationBarSearch,
  UpperNavigationBarNotification,
} from "..";

import { setIsSidebarVisible, setIsOverlayVisible } from '@/store/booleanSlice'

const NavigationBar = () => {

  const dispatch = useDispatch()
  const [image, setImage] = useState("");
  const authStatus = useSelector((state) => state.auth.status);
  const userdata = useSelector((state) => state.auth.userData);
  const myProfile = useSelector((state) => state.profileSlice.userProfile);

  const toggleSideBar = () => {
    dispatch(setIsSidebarVisible(true))
    dispatch(setIsOverlayVisible(true))
  };

  useEffect(() => {

    const profileImage = myProfile?.profileImage ? JSON.parse(myProfile?.profileImage) : undefined;

    let img = profileImage?.profileImageURL;
    if (img) {
      img = img.replace("/preview", "/view");
    } else {
      img = getAvatar(userdata?.name);
    }

    setImage(img);
  }, [myProfile]);

  return (
    <nav className="w-full relative flex flex-col md:flex-row justify-between items-center p-1 md:px-4 shadow-md transition-all gap-2">
      <Logo />
      <div className="flex items-center gap-2 md:gap-4 justify-between md:justify-end w-full md:w-[50%] lg:w-[40%] px-2">
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
