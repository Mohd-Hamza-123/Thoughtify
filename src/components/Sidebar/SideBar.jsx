import React, { useRef, useEffect } from "react";
import "./SideBar.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { UserCircle } from "../";
import { useAskContext } from "../../context/AskContext";
import authService from "../../appwrite/auth";
import { useDispatch, useSelector } from "react-redux";
import { logout, editProfileVisible } from "../../store/authSlice";
import { useState } from "react";

const SideBar = () => {
  const status = useSelector((state) => state.auth.status);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const SideBar = useRef();
  const [name, setname] = useState("Name");
  const { isOpen, setIsOpen } = useAskContext();

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
          setIsOpen(false);
          navigate("/");
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="SideBar p-3" ref={SideBar}>
      <div className="flex justify-between items-center px-1">
        <div
          onClick={() => {
            console.log(SideBar);
            SideBar.current.classList.remove("Active");
          }}
          className="SideBarCross flex gap-3 justify-start items-center"
        >
          <UserCircle />

          <div>
            <p className="font-bold">{name}</p>
          </div>
        </div>

        <div
          className="cursor-pointer"
          onClick={() => {
            setIsOpen(false);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 384 512"
            className="fill-black transfrom scale-150 mr-3"
          >
            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
          </svg>
        </div>
      </div>
      <div className="SideBarContent mt-7 flex flex-col gap-3">
        <div className="flex gap-5 py-2 rounded-md   px-6   hover:bg-gray-500 justify-start items-center">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 512 512"
            >
              <path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm177.6 62.1C192.8 334.5 218.8 352 256 352s63.2-17.5 78.4-33.9c9-9.7 24.2-10.4 33.9-1.4s10.4 24.2 1.4 33.9c-22 23.8-60 49.4-113.6 49.4s-91.7-25.5-113.6-49.4c-9-9.7-8.4-24.9 1.4-33.9s24.9-8.4 33.9 1.4zM144.4 208a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm165.8 21.7c-7.6 8.1-20.2 8.5-28.3 .9s-8.5-20.2-.9-28.3c14.5-15.5 35.2-22.3 54.6-22.3s40.1 6.8 54.6 22.3c7.6 8.1 7.1 20.7-.9 28.3s-20.7 7.1-28.3-.9c-5.5-5.8-14.8-9.7-25.4-9.7s-19.9 3.8-25.4 9.7z" />
            </svg>
          </div>

          <p>Set Status</p>
        </div>

        <hr />

        <Link to={`/profile/${userData?.$id}`}>
          <div
            id="Sidebar_Svg"
            className="flex gap-5 py-2 rounded-md px-6  hover:bg-gray-500 justify-start items-center"
            onClick={() => setIsOpen(false)}
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
            className="flex gap-5 py-2 rounded-md px-6  hover:bg-gray-500 justify-start items-center cursor-pointer"
            onClick={() => {
              setIsOpen(false);
              setTimeout(() => {
                dispatch(editProfileVisible());
              }, 500);
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

        <div className="flex gap-5 py-2 rounded-md px-6  hover:bg-gray-500 justify-start items-center">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 512 512"
            >
              <path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z" />
            </svg>
          </div>

          <p>Setting</p>
        </div>

        <div className="flex gap-5 py-2 rounded-md px-6  hover:bg-gray-500 justify-start items-center">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 512 512"
            >
              <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" />
            </svg>
          </div>

          <p>Messages</p>
        </div>

        <div className="flex gap-5 py-2 rounded-md px-6  hover:bg-gray-500 justify-start items-center">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 512 512"
            >
              <path d="M64 0C28.7 0 0 28.7 0 64V352c0 35.3 28.7 64 64 64h96v80c0 6.1 3.4 11.6 8.8 14.3s11.9 2.1 16.8-1.5L309.3 416H448c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H64z" />
            </svg>
          </div>

          <p>Your Opinions</p>
        </div>

        <div className="flex gap-5 py-2 rounded-md px-6  hover:bg-gray-500 justify-start items-center">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 640 512"
            >
              <path d="M64 64a64 64 0 1 1 128 0A64 64 0 1 1 64 64zM25.9 233.4C29.3 191.9 64 160 105.6 160h44.8c27 0 51 13.4 65.5 34.1c-2.7 1.9-5.2 4-7.5 6.3l-64 64c-21.9 21.9-21.9 57.3 0 79.2L192 391.2V464c0 26.5-21.5 48-48 48H112c-26.5 0-48-21.5-48-48V348.3c-26.5-9.5-44.7-35.8-42.2-65.6l4.1-49.3zM448 64a64 64 0 1 1 128 0A64 64 0 1 1 448 64zM431.6 200.4c-2.3-2.3-4.9-4.4-7.5-6.3c14.5-20.7 38.6-34.1 65.5-34.1h44.8c41.6 0 76.3 31.9 79.7 73.4l4.1 49.3c2.5 29.8-15.7 56.1-42.2 65.6V464c0 26.5-21.5 48-48 48H496c-26.5 0-48-21.5-48-48V391.2l47.6-47.6c21.9-21.9 21.9-57.3 0-79.2l-64-64zM272 240v32h96V240c0-9.7 5.8-18.5 14.8-22.2s19.3-1.7 26.2 5.2l64 64c9.4 9.4 9.4 24.6 0 33.9l-64 64c-6.9 6.9-17.2 8.9-26.2 5.2s-14.8-12.5-14.8-22.2V336H272v32c0 9.7-5.8 18.5-14.8 22.2s-19.3 1.7-26.2-5.2l-64-64c-9.4-9.4-9.4-24.6 0-33.9l64-64c6.9-6.9 17.2-8.9 26.2-5.2s14.8 12.5 14.8 22.2z" />
            </svg>
          </div>

          <p>Global Chat</p>
        </div>

        <div className="flex gap-5 py-2 rounded-md px-6  hover:bg-gray-500 justify-start items-center">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 576 512"
            >
              <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
            </svg>
          </div>

          <p>Favourite</p>
        </div>

        <hr />

        {isOpen && (
          <div
            className="flex gap-5 py-2 rounded-md px-6  hover:bg-gray-500 justify-start items-center cursor-pointer"
            onClick={logouthandle}
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
      </div>
    </div>
  );
};

export default SideBar;
