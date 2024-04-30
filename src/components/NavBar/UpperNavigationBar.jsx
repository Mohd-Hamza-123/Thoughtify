import React, { useEffect, useRef, useState } from "react";
import "./UpperNavigationBar.css";
import { Link, useNavigate } from "react-router-dom";
import { useAskContext } from "../../context/AskContext";
import { Container, SideBar } from "../index";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { Input } from "../index";
import QueryFlow from "../../assets/QueryFlow.png";
import '../../index.css'
import { useForm } from "react-hook-form";
import NoProfile from '../../assets/NoProfile.png'
import notification from '../../appwrite/notification'

const NavigationBar = () => {
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.status);

  const { setIsOpen, notificationPopUp,
    setnotificationPopUp, myUserProfile, notificationShow, setNotificationShow, setisOverlayBoolean, notifications, setnotifications, setNotificationPopMsgNature, setnotificationPopMsg, deleteNotication, isUnreadNotificationExist, setIsUnreadNotificationExist, isDarkModeOn } = useAskContext();

  const { register, handleSubmit, setValue } = useForm()

  const BarItems = [
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
    setisOverlayBoolean(true)
  };
  const submit = async (data) => {

    navigate(`/BrowseQuestion/${null}/${data.searchQuestion}`)
    setValue("searchQuestion", "")
  }
  const updateNotification = async (notificationID) => {
    console.log(notificationID)
    notification
      .updateNotification({ notificationID, isRead: true })
      .then((res) => {
        const newNotificationArr = notifications?.map((note) => {
          if (note.$id !== notificationID) {
            return note
          } else {
            return res
          }
        })
        setnotifications((prev) => newNotificationArr)
      })
      .catch((err) => console.log(err))
  }


  useEffect(() => {

    setNotificationShow((prev) => notifications)
    const notificationBoolean = notifications?.some((note) => note.isRead === false)

    if (notificationBoolean) {
      setIsUnreadNotificationExist(true)
    } else {
      setIsUnreadNotificationExist(false)
    }

  }, [notifications])
  return (
    <>
      <nav
        id={"nav"}
        className={`${isDarkModeOn ? 'darkMode' : ''}`}
      >
        <div className={`logo_div flex justify-around`}>
          <div
            className="cursor-pointer gap-2 flex items-center"
            onClick={() => navigate("/")}
          >
            <img className={`logo ${isDarkModeOn ? 'darkMode' : ''}`} src={QueryFlow} alt="Logo" />
            <h1 className={`logo_Name ${isDarkModeOn ? 'text-white' : 'text-black'}`}>Thoughtify</h1>
          </div>

        </div>

        <div className="UpperNavigationBar_Nav_Right_Items">
          <div id="UpperNavigationBar_Search_Bar">
            <form onSubmit={handleSubmit(submit)} className="search_Form">

              <div className={`search_icon_div ${isDarkModeOn ? 'darkMode' : ''}`}>
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
                    required: true
                  })}
                  id="UpperNavigationBar_search_Input"
                  className={`outline-none font-bold text-black  rounded-t-none rounded-b-none ${isDarkModeOn ? "darkMode" : ''}`}
                  type="search"
                  placeholder="Search Title"
                />
              </div>

            </form>
          </div>
          {(authStatus && myUserProfile) && <div id="UpperNavigationBar_Bell_Div">
            {isUnreadNotificationExist && <span>!</span>}
            <i onClick={() => setnotificationPopUp((prev) => !prev)} className={`fa-regular fa-bell cursor-pointer ${isDarkModeOn ? 'text-white' : 'text-black'}`}></i>
            <section className={`UpperNavigationBar_Notification_DropDown_Section ${notificationPopUp ? 'active' : ''}`}>

              <ul className="UpperNavigationBarNotificationUL">
                {notificationShow && notificationShow?.map((note, index) => {
                  return <li key={note?.$id} className={`${note.isRead ? 'Read' : 'unRead'} flex gap-1 items-center`}>
                    <div className="flex items-center gap-2">
                      <img
                        onClick={
                          () => {
                            navigate(`/profile/${note?.userID}`)
                          }}
                        className="UpperNavigationBar_Notification_profilePic cursor-pointer" src={note?.userProfilePic || NoProfile}
                        onError={(e) => { e.target.src = NoProfile; }}
                      />
                      <p
                        className="cursor-pointer"
                        onClick={() => {
                          setnotificationPopUp((prev) => !prev)
                          updateNotification(note?.$id);
                          navigate(note.slug)
                        }}> {note?.content}</p>
                    </div>
                    <i onClick={() => {
                      notification.deleteNotication({ notificationID: note?.$id })
                        .then((res) => {
                          setnotifications((prev) => {
                            return prev.filter((noti) => noti?.$id !== note?.$id)
                          })
                          setNotificationPopMsgNature(true)
                          setnotificationPopMsg("Notification Deleted")
                        })

                    }} className={`fa-solid fa-trash UpperNavBar_deleteNotification cursor-pointer `}></i>
                  </li>

                })}
                {notifications?.length > 0 && <span
                  onClick={() => {
                    deleteNotication();
                    setnotifications((prev) => [])
                    setNotificationPopMsgNature(true)
                    setnotificationPopMsg("Notifications  Deleted")
                  }}
                  className="inline-block px-2 cursor-pointer text-right mt-2">Delete All Notifications</span>}
                {notifications?.length <= 0 && <li className="UpperNavigationBar_No_Notifications" onClick={() => { setnotificationPopUp((prev) => !prev) }}>No Notifications</li>}
              </ul>

            </section>
            <div onClick={() => setnotificationPopUp((prev) => false)} className={`${notificationPopUp ? 'active' : ''}`} id="UpperNavigationBar_Notificaton_PopUp_overlay">
            </div>
          </div>}
          {(authStatus && myUserProfile) && (
            <div id="upperNavbar_svg_div" onClick={toggleSideBar}>
              <img src={myUserProfile ? myUserProfile?.profileImgURL : NoProfile} alt="fsd" />
            </div>
          )}
          {(!authStatus || !myUserProfile) && <ul className="flex items-center UpperNavigationBar_Buttons_ul">
            {BarItems.map((Item) =>
              Item.active ? (
                <li key={Item.name} className="">
                  <button
                    className="UpperNavigationBar_Buttons inline-bock px-6 py-2 duration-200 rounded-full"
                    onClick={() => navigate(Item.slug)}
                  >
                    {Item.name}
                  </button>
                </li>
              ) : null
            )}
          </ul>}
        </div>
      </nav>
    </>
  );
};

export default NavigationBar;


