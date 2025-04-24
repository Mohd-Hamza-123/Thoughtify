import { useEffect, useRef, useState } from "react";
import { AskProvider } from "./context/AskContext";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "./store/authSlice";
import { useNavigate } from "react-router-dom";
import Overlay from "./components/Overlay/Overlay";
import "./App.css";
import { Loader, NavBar, NotificationPop, SideBar } from "./components";
import appwriteService from "./appwrite/config";
import profile from "./appwrite/profile";
import { userProfile } from "./store/profileSlice";
import { Feedback } from "./components";
import authService from "./appwrite/auth";
import { getInitialPost } from "./store/postsSlice";
import Setting from "./components/Setting/Setting";
import notification from "./appwrite/notification";
import Home from "./pages/Home";
import { useGetProfileData } from "./lib/profile";
import LoginPage from "./pages/LoginPage";
import ForgetPassword from "./pages/ForgetPassword";
import SignupPage from "./pages/SignupPage";
import ViewPostPage from "./pages/ViewPostPage";
import AskQuestion from "./pages/AskQuestion";
import EditAskQuestion from "./pages/EditAskQuestion";
import Profile from "./pages/Profile";
import EditProfilePage from "./pages/EditProfilePage";
import SearchPage from "./pages/SearchPage";
import PersonalChatPage from "./pages/PersonalChatPage";
import ResetPassword from "./pages/ResetPassword";
import FindFriends from "./pages/FindFriends";
import RespondersSectionPage from "./pages/RespondersSectionPage";
import TrustedRespondersPage from "./pages/TrustedRespondersPage";
import NotificationProviders from "./Providers/NotificationProvider";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth?.userData);
  const myUserProfile = useSelector((state) => state.profileSlice?.userProfile);
  // console.log(myUserProfile)
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isOverlayBoolean, setisOverlayBoolean] = useState(false);
  const [feedbackPopUp, setfeedbackPopUp] = useState(false);
  const [SettingPopUp, SetSettingPopUp] = useState(false);
  const [notificationPopUp, setnotificationPopUp] = useState(false);
  const [notificationShow, setNotificationShow] = useState(null);
  const [hasMorePostsInHome, sethasMorePostsInHome] = useState(true);
  const [hasMoreComments, sethasMoreComments] = useState(true);
  const [hasMorePostsInBrowseQuestions, sethasMorePostsInBrowseQuestions] =
    useState(true);
  const [
    hasMorePostsInProfileFilterQuestions,
    sethasMorePostsInProfileFilterQuestions,
  ] = useState(true);
  const [
    hasMorePostsInProfileFilterOpinions,
    sethasMorePostsInProfileFilterOpinions,
  ] = useState(true);
  const [
    hasMorePostsInProfileFilterBookmark,
    sethasMorePostsInProfileFilterBookmark,
  ] = useState(true);
  const [hasMorePostInTrustedPost, sethasMorePostInTrustedPost] =
    useState(true);
  const [queries, setQueries] = useState([]);

  // For notification bell icon
  const [isUnreadNotificationExist, setIsUnreadNotificationExist] =
    useState(true);

  // To my Profile Posts
  const [savedMyProfilePosts, setSavedMyProfilePosts] = useState(null);

  // To save my Comments
  const [savedMyProfileComments, setsavedMyProfileComments] = useState(null);

  const [mainResponder, setmainResponder] = useState(null);

  const indicator = useRef(true);

  const urlParams = new URLSearchParams(window.location.search);
  const secret = urlParams.get("secret");
  const userId = urlParams.get("userId");

  const [isDarkModeOn, setisDarkModeOn] = useState(
    localStorage.getItem("isDarkModeOn") === "true"
  );

  const { getProfileData } = useGetProfileData()

  const fetchData = async () => {
    try {
      const userData = await authService.getCurrentUser();
      if (userData) {
        dispatch(login({ userData }));
        const response = await profile.listProfile({ slug: userData?.$id });
        console.log(response)
        if (response?.documents?.length === 0 || response?.total === 0) {
          const response = await profile.createProfile({
            name: userData?.name,
            userIdAuth: userData?.$id,
            profileImgID: null,
            profileImgURL:
              "https://cdn.pixabay.com/photo/2014/04/02/10/25/man-303792_1280.png",
          });
          dispatch(userProfile({ userProfile: response?.documents[0] }));
          if (response) {
            navigate("/");
          } else {
            navigate("/signup");
          }
        } else {
          dispatch(userProfile({ userProfile: response?.documents[0] }));
          const profileImageID = response?.documents[0]?.profileImgID;
          const URL = await profile.getStoragePreview(profileImageID);

          if (URL) {
            dispatch(
              userProfile({
                userProfile: userProfile?.documents[0],
                userProfileImgURL: URL?.href,
              })
            );
          } else {
            dispatch(
              userProfile({
                userProfile: userProfile?.documents[0],
                userProfileImgURL: "",
              })
            );
          }
          navigate("/");
        }
      }
    } catch (err) {
      console.log("error", err)
      navigate("/signup");
    } finally {
      setLoading(false);
    }
  };

  // getting notifications
  const [notifications, setnotifications] = useState(null);

  const deleteNotication = async () => {
    const listdocumentstoDelete = await notification.getNotification({
      userID: userData?.$id,
    });

    for (let i = 0; i < listdocumentstoDelete.documents.length; i++) {
      let notificationID = listdocumentstoDelete?.documents[i]?.$id;
      if (!notificationID) return;
      notification.deleteNotication({ notificationID });
    }
  };

  const increaseViews = async (PostId) => {
    const previesViews = await appwriteService.getPost(PostId);
    const updateViews = await appwriteService.updatePostViews(
      PostId,
      previesViews.views + 1,
      previesViews.commentCount
    );
    dispatch(getInitialPost({ initialPosts: [updateViews] }));
  };

  const verifyEmail = () => {
    if (userId && secret) {
      authService.verifyWithUserId_secret(userId, secret).then((res) => {
        if (res) {
          setNotificationPopMsgNature(true);
          setnotificationPopMsg("You Email is Verified");
        }
      });
    }
  };

  async function getNotification() {
    try {
      const userData = await authService.getCurrentUser();
      const res = await notification.getNotification({ userID: userData?.$id });

      setnotifications(res?.documents);

      if (res?.total > 25) {
        const totalItemsToDelete = res?.total - 25;

        const limitToDelete = Math.min(totalItemsToDelete, 50);
        const listdocumentstoDelete = await notification.getNotification({
          userID: userData?.$id,
          limit: limitToDelete,
        });

        for (let i = 0; i < limitToDelete; i++) {
          let notificationID = listdocumentstoDelete?.documents[i]?.$id;
          if (!notificationID) return;
          notification.deleteNotication({ notificationID });
        }
      }
    } catch (error) {
      setnotifications([]);
    }
  }

  const [appInstallPrompt, setAppInstallPrompt] = useState(null);
  const [isAppInstalled, setisAppInstalled] = useState(true);

  const onInstallApp = async () => {
    if (appInstallPrompt) {
      appInstallPrompt.prompt();
      appInstallPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          // User accepted the install prompt
          setisAppInstalled(true);
        } else {
          // User dismissed the install prompt
          setisAppInstalled(false);
        }
      });
    }
  };

  useEffect(() => {
    const installApp = (e) => {
      e.preventDefault();
      setAppInstallPrompt(e);

      // Optionally, you can check if the app is already installed as standalone
      if (
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone === true
      ) {
        setisAppInstalled(true);
      } else {
        setisAppInstalled(false);
      }
    };

    window.addEventListener("beforeinstallprompt", installApp);

    return () => {
      window.removeEventListener("beforeinstallprompt", installApp);
    };
  }, []);

  // useEffect(() => {
  //   if (!body) return;
  //   if (isDarkModeOn) {
  //     localStorage.setItem("isDarkModeOn", true);
  //     body[0].classList.add("darkMode");
  //   } else {
  //     localStorage.setItem("isDarkModeOn", false);
  //     body[0].classList.remove("darkMode");
  //   }
  // }, [isDarkModeOn]);

  useEffect(() => {
    if (indicator.current) {
      fetchData();
      indicator.current = false;
    }
    verifyEmail();
    getNotification();
    authService.getCurrentUser().then((res) => {
      dispatch(login({ userData: res }))
    })

    // authService.logout().then((res) => console.log(res))
  }, []);

  

  useEffect(() => {
    if (!myUserProfile && userData) {
      const profileData = getProfileData();
      dispatch(userProfile({ userProfile: profileData }));
    }
  }, [userData]);

  return !loading ? (
    <NotificationProviders>
      <AskProvider
        value={{
          isAppInstalled,
          onInstallApp,
          queries,
          setQueries,
          hasMorePostsInProfileFilterBookmark,
          sethasMorePostsInProfileFilterBookmark,
          hasMorePostsInProfileFilterOpinions,
          sethasMorePostsInProfileFilterOpinions,
          hasMorePostsInProfileFilterQuestions,
          sethasMorePostsInProfileFilterQuestions,
          hasMorePostsInBrowseQuestions,
          sethasMorePostsInBrowseQuestions,
          hasMorePostInTrustedPost,
          sethasMorePostInTrustedPost,
          hasMoreComments,
          sethasMoreComments,
          hasMorePostsInHome,
          sethasMorePostsInHome,
          notificationPopUp,
          setnotificationPopUp,
          notificationShow,
          setNotificationShow,
          increaseViews,
          feedbackPopUp,
          setfeedbackPopUp,
          SettingPopUp,
          SetSettingPopUp,
          isOverlayBoolean,
          setisOverlayBoolean,
          isOpen,
          setIsOpen,
          notifications,
          setnotifications,
          deleteNotication,
          isUnreadNotificationExist,
          setIsUnreadNotificationExist,
          isDarkModeOn,
          setisDarkModeOn,
          mainResponder,
          setmainResponder,
          savedMyProfilePosts,
          setSavedMyProfilePosts,
          savedMyProfileComments,
          setsavedMyProfileComments,
        }}
      >
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="profile/:slug" element={<Profile />} />
          <Route path="Find-People" element={<FindFriends />} />
          <Route path="AskQuestion" element={<AskQuestion />} />
          <Route path="forgotPassword" element={<ForgetPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="EditQuestion/:slug" element={<EditAskQuestion />} />
          <Route path="/trustedResponders" element={<TrustedRespondersPage />} />
          <Route
            path="EditProfile/:editProfileSlug"
            element={<EditProfilePage />}
          />
          <Route
            path="ChatRoom/:senderSlug/:receiverSlug"
            element={<PersonalChatPage />}
          />
          <Route
            path="BrowseQuestion/:category/:searchInput"
            element={<SearchPage />}
          />
          <Route path="post/:slug/:filterCommentID" element={<ViewPostPage />} />
          <Route path="Responders-Section" element={<RespondersSectionPage />} />
        </Routes>
        <SideBar />
        <Overlay />
        <Setting />
        <Feedback />

        <NotificationPop
        // notificationPopMsg={notificationPopMsg}
        // notificationPopMsgNature={notificationPopMsgNature}
        />
      </AskProvider>
    </NotificationProviders>
  ) : (
    <Loader />
  );
}

export default App;
