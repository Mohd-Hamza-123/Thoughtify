import "./SideBar.css";
import Icons from "../Icons";
import { toast } from "sonner"
import { useState } from "react";
import { ProfileImage } from "../Logo";
import { Link } from "react-router-dom";
import authService from "../../appwrite/auth";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/authSlice";
import React, { useRef, useEffect } from "react";
import { userProfile } from "@/store/profileSlice";
import { useDispatch, useSelector } from "react-redux";
import { useAskContext } from "../../context/AskContext";
import { useBooleanContext } from "@/context/BooleanContext";


const SideBar = () => {

  const SideBar = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState("Name");
  const status = useSelector((state) => state.auth.status);

  const {
    onInstallApp,
    isAppInstalled,
  } = useAskContext();

  const { setIsOverlayVisible, isSidebarVisible, setIsSidebarVisible } = useBooleanContext();

  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    if (status) setName(userData?.name)
    else setName("")
  }, [status]);

  useEffect(() => {
    if (isSidebarVisible) SideBar.current.classList.add("Active")
    else SideBar.current.classList.remove("Active")
  }, [isSidebarVisible,]);

  const closeSideBarAndOverlay = () => {
    setIsSidebarVisible(false)
    setIsOverlayVisible(false);
  };

  const logoutHandle = async () => {
    try {
      await authService.logout();
      dispatch(logout());
      dispatch(userProfile({ userProfile: null }))
      closeSideBarAndOverlay();
      navigate("/");
      toast.success("You have successfully logged out");
    } catch (err) {
      const message = err instanceof Error ? err.message : err;
      if (import.meta.env.DEV) console.log(message)
      toast.error("Unable to log out");
    }
  };

  const sideBarLinks = [
    {
      name: "My Profile",
      slug: `/profile/${userData?.$id}`,
      icon: <Icons.profile />,
    },
    {
      name: "Edit Profile",
      slug: `/edit-profile/${userData?.$id}`,
      icon: <Icons.edit />,
    },
    {
      name: "About Creater",
      slug: `/profile/6a1121831572c33323b2`,
      icon: <Icons.special />,
    },
  ];

  return (
    <div className="SideBar poppins" ref={SideBar}>
      <div className="flex justify-between items-center px-1">

        <Link to={`/profile/${userData?.$id}`}>
          <div
            onClick={closeSideBarAndOverlay}
            className="SideBarCross flex gap-3 justify-start items-center">
            <ProfileImage />
            <p className="poppins">{name}</p>
          </div>
        </Link>

        <Icons.cross
          className="mr-3 cursor-pointer hover:scale-110 transition-all duration-75"
          onClick={closeSideBarAndOverlay}
        />

      </div>

      <div className="SideBarContent">

        {sideBarLinks.map((option) => (
          <Link to={option.slug} key={option.name}>
            <div
              className="SideBarItems flex gap-5 py-2 rounded-md px-6 justify-start items-center"
              onClick={closeSideBarAndOverlay}>
              {option.icon}
              <p>{option.name}</p>
            </div>
          </Link>
        ))}

        {isAppInstalled && (
          <div
            className="SideBarItems cursor-pointer flex gap-5 py-2 rounded-md px-6 justify-start items-center"
            onClick={(e) => {
              closeSideBarAndOverlay();
              onInstallApp();
            }}>
            <Icons.download />
            <p>Download App</p>
          </div>
        )}

        <hr />

        {isSidebarVisible && (
          <div
            className="SideBarItems flex gap-5 py-2 rounded-md px-6 justify-start items-center cursor-pointer"
            onClick={logoutHandle}>
            <Icons.logout />
            <p>LogOut</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default SideBar;
