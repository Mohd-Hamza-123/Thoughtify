import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAskContext } from "@/context/AskContext";
import { updateNotification } from "@/lib/notifications";
const UpperNavigationBarNotification = () => {
  const authStatus = useSelector((state) => state.auth.status);
  const {
    isDarkModeOn,
    notifications,
    notificationShow,
    setnotifications,
    deleteNotication,
    notificationPopUp,
    setNotificationShow,
    setnotificationPopUp,
    setnotificationPopMsg,
    isUnreadNotificationExist,
    setNotificationPopMsgNature,
    setIsUnreadNotificationExist,
  } = useAskContext();

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

  const Notification = async (notificationID) => {
    try {
      const newNotificationArr = await updateNotification(notificationID);
      setnotifications(newNotificationArr);
    } catch (error) {
      setnotifications([]);
    }
  };

  return (
    authStatus && (
      <div id="UpperNavigationBar_Bell_Div">
        {isUnreadNotificationExist && (
          <span onClick={() => setnotificationPopUp((prev) => !prev)}>!</span>
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
    )
  );
};

export default UpperNavigationBarNotification;
