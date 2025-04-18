import "../../index.css";
import "./UpperNavigationBar.css";
import { Button } from "../ui/button";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { UserCircle, Logo, SvgIcons } from "..";
import NoProfile from "../../assets/NoProfile.png";
import notification from "../../appwrite/notification";
import { useAskContext } from "../../context/AskContext";
import { updateNotification } from "@/lib/notifications";
import { useSelector } from "react-redux/es/hooks/useSelector";

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

  const Notification = async (notificationID) => {
    try {
      const newNotificationArr = await updateNotification(notificationID);
      setnotifications(newNotificationArr);
    } catch (error) {
      setnotifications([]);
    }
  };

  useEffect(() => {
    setNotificationShow(notifications);
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
      <nav
        id={"nav"}
        className="w-screen relative z-10 flex flex-col md:flex-row justify-between items-center px-4 py-2 shadow-md transition-all"
      >
        <Logo />

        <div className="UpperNavigationBar_Nav_Right_Items">
          <div id="UpperNavigationBar_Search_Bar">
            <form onSubmit={handleSubmit(submit)} className="search_Form">
              <div
                className={`search_icon_div ${isDarkModeOn ? "darkMode" : ""}`}
              >
                <button type="submit">
                  <SvgIcons.search />
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
                                Notification(note?.$id);
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
              <UserCircle />
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
