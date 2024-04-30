import { useEffect, useRef, useState } from "react";
import { AskProvider } from "./context/AskContext";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "./store/authSlice";
import { useNavigate } from "react-router-dom";
import Overlay from "./components/Overlay/Overlay";
import "./App.css";
import { Loader, NotificationPop, SideBar } from "./components";
import appwriteService from "./appwrite/config";
import profile from "./appwrite/profile";
import { getUserProfile } from "./store/profileSlice";
import { Feedback } from "./components";
import authService from "./appwrite/auth";
import { getInitialPost } from "./store/postsSlice";
import avatar from "./appwrite/avatars";
import Setting from "./components/Setting/Setting";
import notification from "./appwrite/notification";
import ResetPassword from "./pages/ResetPassword";


function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);


  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isOverlayBoolean, setisOverlayBoolean] = useState(false)
  const [feedbackPopUp, setfeedbackPopUp] = useState(false);
  const [SettingPopUp, SetSettingPopUp] = useState(false);
  const [notificationPopUp, setnotificationPopUp] = useState(false);
  const [myUserProfile, setMyUserProfile] = useState(null)
  const [notificationShow, setNotificationShow] = useState(null)
  const [hasMorePostsInHome, sethasMorePostsInHome] = useState(true)
  const [hasMoreComments, sethasMoreComments] = useState(true)
  const [hasMorePostsInBrowseQuestions, sethasMorePostsInBrowseQuestions] = useState(true)
  const [hasMorePostsInProfileFilterQuestions, sethasMorePostsInProfileFilterQuestions] = useState(true)
  const [hasMorePostsInProfileFilterOpinions, sethasMorePostsInProfileFilterOpinions] = useState(true)
  const [hasMorePostsInProfileFilterBookmark, sethasMorePostsInProfileFilterBookmark] = useState(true)
  const [hasMorePostInTrustedPost, sethasMorePostInTrustedPost] = useState(true);
  const [queries, setQueries] = useState([]);

  //For Notification Pop
  const [notificationPopMsg, setnotificationPopMsg] = useState('')
  const [notificationPopMsgNature, setNotificationPopMsgNature] = useState(false);

  // For notification bell icon
  const [isUnreadNotificationExist, setIsUnreadNotificationExist] = useState(true);

  // For personal Chat Messages
  const [savedPersonalChatMsgs, setsavedPersonalChatMsgs] = useState(null);

  // To my Profile Posts
  const [savedMyProfilePosts, setSavedMyProfilePosts] = useState(null);

  // To save my Comments
  const [savedMyProfileComments, setsavedMyProfileComments] = useState(null)


  const [mainResponder, setmainResponder] = useState(null);

  const indicator = useRef(true);


  const urlParams = new URLSearchParams(window.location.search);
  const secret = urlParams.get('secret');
  const userId = urlParams.get('userId');

  const body = document.getElementsByTagName('body');

  const [isDarkModeOn, setisDarkModeOn] = useState(localStorage.getItem("isDarkModeOn") === 'true');


  const fetchData = async () => {
    try {
      const userData = await authService.getCurrentUser();

      if (userData) {
        dispatch(login({ userData }))

        const userProfile = await profile.listProfile({ slug: userData?.$id });

        if (userProfile.documents.length === 0 || userProfile.total === 0) {

          let profileAvatar = await avatar.profileAvatar(userData?.name);
          let response = await fetch(profileAvatar.href)
          let blob = await response.blob();
          const file = new File([blob], userData.name || 'downloaded_image', { type: 'image/*' });
          const createProfileBucket = await profile.createBucket({ file })
          const getProfileURL = await profile.getStoragePreview(createProfileBucket.$id)
          const profileImgURL = getProfileURL.href;
          const userProfile = await profile.createProfile({
            name: userData?.name,
            userIdAuth: userData?.$id,
            profileImgID: createProfileBucket.$id,
            profileImgURL,
          })
          setMyUserProfile((prev) => userProfile)

          dispatch(getUserProfile({ userProfile }))
          if (userProfile) {
            navigate("/");
          } else {
            setError("Please check the credentials");
          }

        } else {

          setMyUserProfile(prev => userProfile.documents[0]);

          dispatch(getUserProfile({ userProfile: userProfile.documents[0] }));

          const profileImageID = userProfile.documents[0]?.profileImgID
          const URL = await profile.getStoragePreview(profileImageID);

          if (URL) {
            dispatch(getUserProfile({ userProfileImgURL: URL.href }));
          }
          navigate("/");
        }

      } else {
        throw new Error("User not logged in");
      }
    } catch (err) {

      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (body) {
      if (isDarkModeOn) {

        localStorage.setItem("isDarkModeOn", true);
        body[0].classList.add("darkMode")
      } else {

        localStorage.setItem("isDarkModeOn", false)
        body[0].classList.remove("darkMode")
      }
    }
  }, [isDarkModeOn])

  useEffect(() => {

    if (userId && secret) {
      authService.verifyWithUserId_secret(userId, secret)
        .then((res) => {
          console.log(res);
          if (res) {
            setNotificationPopMsgNature((prev) => true);
            setnotificationPopMsg((prev) => "You Email is Verified");
          }
        })
        .catch((err) => {
          console.error(err)
        })
    }

  }, [])
  useEffect(() => {
    if (indicator.current) {
      fetchData();
      indicator.current = false
    }

  }, []);

  useEffect(() => {
    async function getData() {
      const userData = await authService.getCurrentUser();
      const userProfile = await profile.listProfile({ slug: userData?.$id });
      setMyUserProfile(prev => userProfile?.documents[0]);
    }
    if (!myUserProfile && userData) {
      getData()
    }
  }, [userData])

  // getting notifications
  const [notifications, setnotifications] = useState(null);

  useEffect(() => {
    async function getNotification() {
      const userData = await authService.getCurrentUser();
      try {
        const res = await notification.getNotification({ userID: userData?.$id });

        setnotifications((prev) => res?.documents)

        if (res?.total > 25) {
          const totalItemsToDelete = res?.total - 25;

          const limitToDelete = Math.min(totalItemsToDelete, 50);
          const listdocumentstoDelete = await notification.getNotification({ userID: userData?.$id, limit: limitToDelete });

          for (let i = 0; i < limitToDelete; i++) {
            let notificationID = listdocumentstoDelete?.documents[i]?.$id;
            if (!notificationID) return;
            notification.deleteNotication({ notificationID });
          }
        }

      } catch (error) {
        console.error(error)
      }


    }
    getNotification()
  }, []);

  const increaseViews = async (PostId) => {
    try {
      const previesViews = await appwriteService.getPost(PostId)
      const updateViews = await appwriteService.updatePostViews(PostId, previesViews.views + 1, previesViews.commentCount);

      dispatch(getInitialPost({ initialPosts: [updateViews] }))
    } catch (error) {
      console.log("Error")
    }
  }
  const deleteNotication = async () => {
    const listdocumentstoDelete = await notification.getNotification({ userID: userData?.$id });

    for (let i = 0; i < listdocumentstoDelete.documents.length; i++) {
      let notificationID = listdocumentstoDelete?.documents[i]?.$id;
      if (!notificationID) return;
      notification.deleteNotication({ notificationID });
    }
  }



  return !loading ? (
    <>
      <AskProvider
        value={{
          queries, setQueries,
          hasMorePostsInProfileFilterBookmark,
          sethasMorePostsInProfileFilterBookmark,
          hasMorePostsInProfileFilterOpinions, sethasMorePostsInProfileFilterOpinions,
          hasMorePostsInProfileFilterQuestions,
          sethasMorePostsInProfileFilterQuestions,
          hasMorePostsInBrowseQuestions,
          sethasMorePostsInBrowseQuestions,
          hasMorePostInTrustedPost, sethasMorePostInTrustedPost,
          hasMoreComments,
          sethasMoreComments,
          hasMorePostsInHome,
          sethasMorePostsInHome,
          myUserProfile,
          setMyUserProfile,
          notificationPopUp,
          setnotificationPopUp,
          notificationShow,
          setNotificationShow,
          increaseViews,
          feedbackPopUp,
          setfeedbackPopUp,
          SettingPopUp, SetSettingPopUp,
          isOverlayBoolean, setisOverlayBoolean,
          isOpen,
          setIsOpen,
          notificationPopMsg, setnotificationPopMsg,
          notificationPopMsgNature, setNotificationPopMsgNature,
          notifications, setnotifications,
          deleteNotication,
          isUnreadNotificationExist, setIsUnreadNotificationExist,
          isDarkModeOn, setisDarkModeOn,
          mainResponder, setmainResponder,
          savedPersonalChatMsgs, setsavedPersonalChatMsgs,
          savedMyProfilePosts, setSavedMyProfilePosts,
          savedMyProfileComments, setsavedMyProfileComments,
        }}
      >

        <NotificationPop notificationPopMsg={notificationPopMsg} notificationPopMsgNature={notificationPopMsgNature} />
        <Feedback />
        <Setting />
        <Outlet />
        <SideBar />
        <Overlay />

      </AskProvider>
    </>
  ) : <Loader />;
}

export default App;
