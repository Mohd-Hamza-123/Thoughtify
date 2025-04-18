import React, { useRef, useEffect } from "react";
import "./SideBar.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { DarkModeToggle, UserCircle } from "../";
import { useAskContext } from "../../context/AskContext";
import authService from "../../appwrite/auth";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authSlice";
import { useState } from "react";
import conf from "../../conf/conf";
import SvgIcons from "../SvgIcons";

const SideBar = () => {
  const status = useSelector((state) => state.auth.status);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const SideBar = useRef();
  const [name, setname] = useState("Name");
  const {
    isOpen,
    setIsOpen,
    isDarkModeOn,
    onInstallApp,
    isAppInstalled,
    setnotifications,
    setMyUserProfile,
    setisOverlayBoolean,
  } = useAskContext();

  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    if (status) {
      authService
        .getCurrentUser()
        .then((data) => {
          setname(data.name);
        })
        .catch((err) => {
          setname("Name");
        });
    } else {
      setname("Name");
    }
  }, [status]);

  useEffect(() => {
    if (isOpen) {
      SideBar.current.classList.add("Active");
    } else {
      SideBar.current.classList.remove("Active");
    }
  }, [isOpen, setIsOpen]);

  const logouthandle = () => {
    try {
      authService
        .logout()
        .then(() => {
          dispatch(logout());
          setMyUserProfile(null);
          setnotifications((prev) => null);
          setIsOpen(false);
          navigate("/");
        })
        .catch((err) => "");
    } catch (error) {}
  };

  return (
    <div className="SideBar" ref={SideBar}>
      <div className="flex justify-between items-center px-1">
        <div
          onClick={() => {
            navigate(`/profile/${userData?.$id}`);
            SideBar.current.classList.remove("Active");
            setIsOpen(false);
            setisOverlayBoolean(false);
          }}
          className="SideBarCross flex gap-3 justify-start items-center"
        >
          <UserCircle />
          <div className="SideBar_Profile_Name">
            <p>{name}</p>
          </div>
        </div>

        <div
          className="cursor-pointer"
          onClick={() => {
            setIsOpen(false);
            setisOverlayBoolean(false);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 384 512"
            className={`${
              isDarkModeOn ? "fill-white" : "fill-black"
            } transfrom scale-150 mr-3`}
          >
            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
          </svg>
        </div>
      </div>

      <div className="SideBarContent">
        <Link to={`/profile/${userData?.$id}`}>
          <div
            id="Sidebar_Svg"
            className="SideBarItems flex gap-5 py-2 rounded-md px-6 justify-start items-center"
            onClick={() => {
              setIsOpen(false);
              setisOverlayBoolean(false);
            }}
          >
            <SvgIcons.myProfile />
            <p>My Profile</p>
          </div>
        </Link>

        <Link to={`/EditProfile/${userData?.$id}`}>
          <div
            className="SideBarItems flex gap-5 py-2 rounded-md px-6  justify-start items-center cursor-pointer"
            onClick={() => {
              setIsOpen(false);
              setisOverlayBoolean(false);
            }}
          >
            <SvgIcons.editProfile />
            <p>Edit Profile</p>
          </div>
        </Link>

        <div
          onClick={() => {
            navigate(`/profile/${conf.myPrivateUserID}`);
            setIsOpen(false);
            setisOverlayBoolean(false);
          }}
          className="SideBarItems flex gap-5 py-2 rounded-md px-6 justify-start items-center cursor-pointer"
        >
          <SvgIcons.aboutCreater />
          <p>About Creater</p>
        </div>

        <div
          className="SideBarItems cursor-pointer flex gap-5 py-2 rounded-md px-6 justify-start items-center"
          onClick={() => {
            setIsOpen(false);
            setisOverlayBoolean(false);
            navigate("/trustedResponders");
          }}
        >
          <div>
            <i className="fa-solid fa-people-line"></i>
          </div>

          <p>Trusted Responders</p>
        </div>

        {!isAppInstalled && (
          <div
            className="SideBarItems cursor-pointer flex gap-5 py-2 rounded-md px-6 justify-start items-center"
            onClick={(e) => {
              setIsOpen(false);
              setisOverlayBoolean(false);
              onInstallApp();
            }}
          >
            <div>
              <i className="fa-solid fa-download"></i>
            </div>

            <p>Download App</p>
          </div>
        )}

        <hr />

        {isOpen && (
          <div
            className="SideBarItems flex gap-5 py-2 rounded-md px-6  justify-start items-center cursor-pointer"
            onClick={() => {
              logouthandle();
              setIsOpen(false);
              setisOverlayBoolean(false);
            }}
          >
            <SvgIcons.logout />
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
