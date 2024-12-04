import "./SideBar.css";
import { useState } from "react";
import Icons from "../Icons";
import conf from "../../conf/conf";
import { Link } from "react-router-dom";
import authService from "../../appwrite/auth";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/authSlice";
import React, { useRef, useEffect } from "react";
import { DarkModeToggle } from "../";
import { useDispatch, useSelector } from "react-redux";
import { useAskContext } from "../../context/AskContext";
import { ProfileImage } from "../Logo";

const SideBar = () => {

  const SideBar = useRef();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState("Name");
  const status = useSelector((state) => state.auth.status);

  const {
    isOpen,
    setIsOpen,
    onInstallApp,
    isAppInstalled,
    setMyUserProfile,
    setisOverlayBoolean,
  } = useAskContext();

  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    if (status) setName(userData?.name)
    else setName("")
  }, [status]);

  useEffect(() => {
    if (isOpen) SideBar.current.classList.add("Active")
    else SideBar.current.classList.remove("Active")
  }, [isOpen, setIsOpen]);

  const closeSideBarAndOverlay = () => {
    setIsOpen(false);
    setisOverlayBoolean(false);
  };

  const logoutHandle = async () => {
    try {
      const res = await authService.logout();
      console.log(res);
      if (res) {
        dispatch(logout());
        setMyUserProfile(null);
        closeSideBarAndOverlay();
        navigate("/");
      }
    } catch (err) {
      // show message popup
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
      slug: `/EditProfile/${userData?.$id}`,
      icon: <Icons.edit />,
    },
    {
      name: "Chat",
      slug: `/chat/${userData?.$id}`,
      icon: <Icons.chats />

    },
    {
      name: "About Creater",
      slug: `/profile/${conf.myPrivateUserID}`,
      icon: <Icons.special />,
    },
    {
      name: "Trusted Responders",
      slug: `/trustedResponders`,
      icon: <Icons.trusted />,
    },
  ];

  return (
    <div className="SideBar poppins" ref={SideBar}>
      <div className="flex justify-between items-center px-1">
        <Link to={`/profile/${userData?.$id}`}>
          <div
            onClick={closeSideBarAndOverlay}
            className="SideBarCross flex gap-3 justify-start items-center"
          >
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
        {sideBarLinks?.map((option) => (
          <Link to={option?.slug} key={option?.name}>
            <div
              className="SideBarItems flex gap-5 py-2 rounded-md px-6 justify-start items-center"
              onClick={closeSideBarAndOverlay}
            >
              {option?.icon}
              <p>{option?.name}</p>
            </div>
          </Link>
        ))}

        {isAppInstalled && (
          <div
            className="SideBarItems cursor-pointer flex gap-5 py-2 rounded-md px-6 justify-start items-center"
            onClick={(e) => {
              closeSideBarAndOverlay();
              onInstallApp();
            }}
          >
            <Icons.download />
            <p>Download App</p>
          </div>
        )}

        <hr />

        {isOpen && (
          <div
            className="SideBarItems flex gap-5 py-2 rounded-md px-6  justify-start items-center cursor-pointer"
            onClick={() => {
              logoutHandle();
              closeSideBarAndOverlay();
            }}
          >
            <Icons.logout />
            <p>LogOut</p>
          </div>
        )}
        <hr />
        <DarkModeToggle />

      </div>
    </div>
  );
};

export default SideBar;
