import React, { useEffect } from "react";
import "./UpperNavigationBar.css";
import { useNavigate } from "react-router-dom";
import { useAskContext } from "../../context/AskContext";
import { useSelector } from "react-redux/es/hooks/useSelector";
import QueryFlow from "../../assets/QueryFlow.png";
import "../../index.css";
import { useForm } from "react-hook-form";
import NoProfile from "../../assets/NoProfile.png";
import notification from "../../appwrite/notification";
import { Button } from "../ui/button";

const NavigationBar = () => {
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.status);

  const {
    setIsOpen,
    notificationPopUp,
    setnotificationPopUp,
    myUserProfile,
    notificationShow,
    setNotificationShow,
    setisOverlayBoolean,
    notifications,
    setnotifications,
    setNotificationPopMsgNature,
    setnotificationPopMsg,
    deleteNotication,
    isUnreadNotificationExist,
    setIsUnreadNotificationExist,
    isDarkModeOn,
  } = useAskContext();

  const { register, handleSubmit, setValue } = useForm();

  const navbarBtn = [
    {
      name: "Login",
      active: !authStatus,
      slug: "/login",
    },
    {
      name: "Sign-In",
      active: !authStatus,
      slug: "/signup",
    },
  ];

  const toggleSideBar = () => {
    setIsOpen(true);
    setisOverlayBoolean(true);
  };
  const submit = async (data) => {
    navigate(`/BrowseQuestion/${null}/${data.searchQuestion}`);
    setValue("searchQuestion", "");
  };
  const updateNotification = async (notificationID) => {
    console.log(notificationID);
    notification
      .updateNotification({ notificationID, isRead: true })
      .then((res) => {
        const newNotificationArr = notifications?.map((note) => {
          if (note.$id !== notificationID) {
            return note;
          } else {
            return res;
          }
        });
        setnotifications((prev) => newNotificationArr);
      });
  };

  useEffect(() => {
    setNotificationShow((prev) => notifications);
    const notificationBoolean = notifications?.some(
      (note) => note?.isRead === false
    );

    if (notificationBoolean) {
      setIsUnreadNotificationExist(true);
    } else {
      setIsUnreadNotificationExist(false);
    }
  }, [notifications]);

  return (
    <>
      <nav id={"nav"} className="w-screen relative z-10 flex flex-col md:flex-row justify-between items-center px-4 py-2 shadow-md transition-all">
        <figure
          onClick={() => navigate("/")}
          className="logo_div flex justify-around cursor-pointer gap-2 items-center"
        >
          <img
            className="w-7 md:w-8 filter brightness-200 dark:invert"
            src={QueryFlow}
            alt="Logo"
          />
          <h1 className="md:text-2xl text-xl font-semibold dark:text-white">
            Thoughtify
          </h1>
        </figure>

        <div className="UpperNavigationBar_Nav_Right_Items">
          <div id="UpperNavigationBar_Search_Bar">
            <form onSubmit={handleSubmit(submit)} className="search_Form">
              <div
                className={`search_icon_div ${isDarkModeOn ? "darkMode" : ""}`}
              >
                <button type="submit">
                  <svg
                    id="search_icon"
                    xmlns="http://www.w3.org/2000/svg"
                    height="1em"
                    viewBox="0 0 512 512"
                  >
                    <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                  </svg>
                </button>
              </div>

              <div className="search_div_input h-inherit">
                <input
                  {...register("searchQuestion", {
                    required: true,
                  })}
                  id="UpperNavigationBar_search_Input"
                  className={`outline-none font-bold text-black  rounded-t-none rounded-b-none ${
                    isDarkModeOn ? "darkMode" : ""
                  }`}
                  type="search"
                  placeholder="Search Title"
                />
              </div>
            </form>
          </div>
          {authStatus && myUserProfile && (
            <div id="UpperNavigationBar_Bell_Div">
              {isUnreadNotificationExist && (
                <span onClick={() => setnotificationPopUp((prev) => !prev)}>
                  !
                </span>
              )}
              <i
                onClick={() => setnotificationPopUp((prev) => !prev)}
                className={`fa-regular fa-bell cursor-pointer ${
                  isDarkModeOn ? "text-white" : "text-black"
                }`}
              ></i>
              <section
                className={`UpperNavigationBar_Notification_DropDown_Section ${
                  notificationPopUp ? "active" : ""
                }`}
              >
                <ul className="UpperNavigationBarNotificationUL">
                  {notificationShow &&
                    notificationShow?.map((note, index) => {
                      return (
                        <li
                          key={note?.$id}
                          className={`${
                            note.isRead ? "Read" : "unRead"
                          } flex gap-1 items-center`}
                        >
                          <div className="flex items-center gap-2">
                            <img
                              onClick={() => {
                                navigate(`/profile/${note?.userID}`);
                              }}
                              className="UpperNavigationBar_Notification_profilePic cursor-pointer"
                              src={note?.userProfilePic || NoProfile}
                              onError={(e) => {
                                e.target.src = NoProfile;
                              }}
                            />
                            <p
                              className="cursor-pointer"
                              onClick={() => {
                                setnotificationPopUp((prev) => !prev);
                                updateNotification(note?.$id);
                                navigate(note.slug);
                              }}
                            >
                              {" "}
                              {note?.content}
                            </p>
                          </div>
                          <i
                            onClick={() => {
                              notification
                                .deleteNotication({ notificationID: note?.$id })
                                .then((res) => {
                                  setnotifications((prev) => {
                                    return prev.filter(
                                      (noti) => noti?.$id !== note?.$id
                                    );
                                  });
                                  setNotificationPopMsgNature(true);
                                  setnotificationPopMsg("Notification Deleted");
                                });
                            }}
                            className={`fa-solid fa-trash UpperNavBar_deleteNotification cursor-pointer `}
                          ></i>
                        </li>
                      );
                    })}
                  {notifications?.length > 0 && (
                    <span
                      onClick={() => {
                        deleteNotication();
                        setnotifications((prev) => []);
                        setNotificationPopMsgNature(true);
                        setnotificationPopMsg("Notifications  Deleted");
                      }}
                      className="inline-block px-2 cursor-pointer text-right mt-2"
                    >
                      Delete All Notifications
                    </span>
                  )}
                  {notifications?.length <= 0 && (
                    <li
                      className="UpperNavigationBar_No_Notifications"
                      onClick={() => {
                        setnotificationPopUp((prev) => !prev);
                      }}
                    >
                      No Notifications
                    </li>
                  )}
                </ul>
              </section>
              <div
                onClick={() => setnotificationPopUp((prev) => false)}
                className={`${notificationPopUp ? "active" : ""}`}
                id="UpperNavigationBar_Notificaton_PopUp_overlay"
              ></div>
            </div>
          )}
          {authStatus && myUserProfile && (
            <div id="upperNavbar_svg_div" onClick={toggleSideBar}>
              <img
                src={myUserProfile ? myUserProfile?.profileImgURL : NoProfile}
              />
            </div>
          )}
          {(!authStatus || !myUserProfile) && (
            <ul className="flex items-center gap-2">
              {navbarBtn.map((Item) =>
                Item.active ? (
                  <li key={Item?.name}>
                    <Button
                      variant="default"
                      className="inline-bock md:px-6 px-4 md:py-2 py-1 duration-200 rounded-full bg-[#16BEF6] hover:bg-[#17A3E8]"
                      onClick={() => navigate(Item?.slug)}
                    >
                      {Item?.name}
                    </Button>
                  </li>
                ) : null
              )}
            </ul>
          )}
        </div>
      </nav>
    </>
  );
};

export default NavigationBar;
