import "./App.css";
import authService from "./appwrite/auth";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { AskProvider } from "./context/AskContext";
import profile from "./appwrite/profile";
import Overlay from "./components/Overlay/Overlay";
import notification from "./appwrite/notification";
import { NavBar, NotificationPop } from "./components";
import Initialization from "./components/Initialization";
import { useNotificationContext } from "./context/NotificationContext";
import {
  Home,
  Profile,
  NotFound,
  LoginPage,
  SignupPage,
  SearchPage,
  FindFriends,
  AskQuestion,
  ViewPostPage,
  ResetPassword,
  ForgetPassword,
  EditAskQuestion,
  EditProfilePage,
  PersonalChatPage,
  RespondersSectionPage,
  TrustedRespondersPage,
} from "./pages/pages";
import { login } from "./store/authSlice";
import { userProfile } from "./store/profileSlice";

function App() {
  const dispatch = useDispatch()
  const authStatus = useSelector((state) => state.auth.status);
  const { setNotification } = useNotificationContext();
  const urlParams = new URLSearchParams(window.location.search);
  const secret = urlParams.get("secret");
  const userId = urlParams.get("userId");

  const verifyEmail = async () => {
    try {
      if (userId && secret) {
        const res = authService.verifyWithUserId_secret(userId, secret);
        if (res) {
          setNotification({ message: "Email Verified", type: "success" })
          const user = await authService.getCurrentUser();
          dispatch(login({ userData: user }));
          let profileData = await profile.updateProfile(
            user.$id,
            {
             verified : user.emailVerification
            }
          );
          dispatch(userProfile({ userProfile: profileData }))
        }
      }
    } catch (error) {
      console.log(error)
      setNotification({ message: error?.message, type: "error" })
    }
  };

  async function getNotification() {
    try {
      const userData = await authService.getCurrentUser();
      const res = await notification.getNotification({ userID: userData?.$id });

    } catch (error) {

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


  useEffect(() => {

    if (userId && secret) verifyEmail();
    if (authStatus) getNotification();

    window.addEventListener("beforeinstallprompt", installApp);
    return () => window.removeEventListener("beforeinstallprompt", installApp);

  }, []);


  return <AskProvider
    value={{
      isAppInstalled,
      onInstallApp,
    }}>

    <Initialization />
    <Overlay />
    <NotificationPop />

    <Routes>

      <Route path="/" Component={NavBar}>
        <Route index Component={Home} />
        <Route path="profile/:slug" Component={Profile} />
        <Route path="Find-People" Component={FindFriends} />
        <Route path="AskQuestion" Component={AskQuestion} />
        <Route path="EditQuestion/:slug" Component={EditAskQuestion} />
        <Route path="trustedResponders" Component={TrustedRespondersPage} />
        <Route path="EditProfile/:slug" Component={EditProfilePage} />
        <Route path="BrowseQuestion/:category/:searchInput" Component={SearchPage} />
        <Route path="ChatRoom/:senderSlug/:receiverSlug" Component={PersonalChatPage} />
        <Route path="post/:slug/:filterCommentID" Component={ViewPostPage} />
        <Route path="Responders-Section" Component={RespondersSectionPage} />
      </Route>

      <Route path="login" Component={LoginPage} />
      <Route path="signup" Component={SignupPage} />
      <Route path="forgotPassword" Component={ForgetPassword} />
      <Route path="reset-password" Component={ResetPassword} />
      <Route path="*" Component={NotFound} />
    </Routes>

  </AskProvider>
}

export default App;
