import React, { useRef, useEffect } from "react";
import "./SideBar.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { UserCircle } from "../";
import { useAskContext } from "../../context/AskContext";
import authService from "../../appwrite/auth";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authSlice";
import { useState } from "react";
import conf from "../../conf/conf";

const SideBar = () => {
  const status = useSelector((state) => state.auth.status);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const SideBar = useRef();
  const [name, setname] = useState("Name");
  const { isOpen, setIsOpen, onInstallApp, isAppInstalled, setMyUserProfile, setisOverlayBoolean, isDarkModeOn, setisDarkModeOn } = useAskContext();

  const userData = useSelector((state) => state.auth.userData);

  // console.log(userData)
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
          setMyUserProfile(null)
          setIsOpen(false);
          navigate("/");
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error.message);
    }
  };

  return (

    <div className="SideBar" ref={SideBar}>
      <div className="flex justify-between items-center px-1">
        <div
          onClick={() => {
            navigate(`/profile/${userData?.$id}`)
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
            className={`${isDarkModeOn ? 'fill-white' : 'fill-black'} transfrom scale-150 mr-3`}
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
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 448 512"
              >
                <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
              </svg>
            </div>

            <p>My Profile</p>
          </div>
        </Link>

        <Link to={`/EditProfile/${userData?.$id}`}>
          <div
            className="SideBarItems flex gap-5 py-2 rounded-md px-6  justify-start items-center cursor-pointer"
            onClick={() => {
              setIsOpen(false);
              setisOverlayBoolean(false)
            }}
          >
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="16"
                width="18"
                viewBox="0 0 576 512"
              >
                <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm80 256h64c44.2 0 80 35.8 80 80c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16c0-44.2 35.8-80 80-80zm-32-96a64 64 0 1 1 128 0 64 64 0 1 1 -128 0zm256-32H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16s7.2-16 16-16z" />
              </svg>
            </div>

            <p>Edit Profile</p>
          </div>
        </Link>

        <div onClick={() => {
          navigate(`/profile/${conf.myPrivateUserID}`)
          setIsOpen(false);
          setisOverlayBoolean(false)
        }} className="SideBarItems flex gap-5 py-2 rounded-md px-6 justify-start items-center cursor-pointer">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
              height="20"
              width="20"
            ><path d="M112 48a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm40 304V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V256.9L59.4 304.5c-9.1 15.1-28.8 20-43.9 10.9s-20-28.8-10.9-43.9l58.3-97c17.4-28.9 48.6-46.6 82.3-46.6h29.7c33.7 0 64.9 17.7 82.3 46.6l58.3 97c9.1 15.1 4.2 34.8-10.9 43.9s-34.8 4.2-43.9-10.9L232 256.9V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V352H152z" /></svg>
          </div>
          <p>About Creater</p>
        </div>

        <div className="SideBarItems cursor-pointer flex gap-5 py-2 rounded-md px-6 justify-start items-center" onClick={() => {
          setIsOpen(false);
          setisOverlayBoolean(false)
          navigate('/trustedResponders')
        }}>
          <div>
            <i className="fa-solid fa-people-line"></i>
          </div>

          <p>Trusted Responders</p>
        </div>


        {!isAppInstalled && <div className="SideBarItems cursor-pointer flex gap-5 py-2 rounded-md px-6 justify-start items-center" onClick={(e) => {
          setIsOpen(false);
          setisOverlayBoolean(false)

          onInstallApp()
        }}>
          <div>
            <i className="fa-solid fa-download"></i>
          </div>

          <p>Download App</p>
        </div>}


        <hr />

        {isOpen && (
          <div
            className="SideBarItems flex gap-5 py-2 rounded-md px-6  justify-start items-center cursor-pointer"
            onClick={() => {
              setIsOpen(false);
              setisOverlayBoolean(false)
              logouthandle();
            }}
          >
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 512 512"
              >
                <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
              </svg>
            </div>

            <p>LogOut</p>
          </div>
        )}
        <hr />
        <div className="SideBar_Day_Night_Mode">

          <div className="SideBar_NightDayIcon_Div">
            <div>
              <label htmlFor="Night">
                <i onClick={() => {
                  setisDarkModeOn((prev) => true)
                  setIsOpen(false);
                  setisOverlayBoolean(false);
                }} className="fa-regular fa-moon flex justify-center cursor-pointer">
                </i>
              </label>
            </div>
            <input onChange={() => setisDarkModeOn((prev) => true)} type="radio" name="Day_Night" id="Night" defaultChecked={isDarkModeOn ? true : false} />
          </div>

          <div className="SideBar_NightDayIcon_Div">
            <div>
              <label htmlFor="Day">
                <i
                  onClick={() => {
                    setisDarkModeOn((prev) => false)
                    setIsOpen(false);
                    setisOverlayBoolean(false);
                  }}
                  className="fa-regular fa-sun cursor-pointer flex justify-center">
                </i>
              </label>
            </div>
            <input onChange={() => setisDarkModeOn((prev) => false)} type="radio" name="Day_Night" id="Day" defaultChecked={isDarkModeOn ? false : true} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default SideBar;
