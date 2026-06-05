import "./App.css";
import { toast } from "sonner"
import { NavBar } from "./components";
import profile from "./appwrite/profile";
import authService from "./appwrite/auth";
import { login } from "./store/authSlice";
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { userProfile } from "./store/profileSlice";
import Overlay from "./components/Overlay/Overlay";
import { AskProvider } from "./context/AskContext";
import notification from "./appwrite/notification";
import { Home, ViewPostPage, } from "./pages/pages";
import { useDispatch, useSelector } from "react-redux";
import Initialization from "./components/Initialization";
import {
  AskQuestion,
  NotFound,
  LoginPage,
  SignupPage,
  ResetPassword,
  ForgotPassword,
  EditAskQuestion,
  FindFriends,
  SearchPage,
  RespondersSectionPage,
  Profile,
  EditProfilePage
} from "@/pages/pages"

function App() {

  const dispatch = useDispatch()
  const authStatus = useSelector((state) => state.auth.status);

  const urlParams = new URLSearchParams(window.location.search);
  const secret = urlParams.get("secret");
  const userId = urlParams.get("userId");

  const verifyEmail = async () => {
    try {
      if (userId && secret) {
        const res = authService.verifyWithUserId_secret(userId, secret);
        if (res) {
          toast.success("Email Verified")
          const user = await authService.getCurrentUser();
          dispatch(login({ userData: user }));
          let profileData = await profile.updateProfile(
            user.$id,
            {
              verified: user.emailVerification
            }
          );
          dispatch(userProfile({ userProfile: profileData }))
        }
      }
    } catch (error) {
      console.error(error instanceof Error ? error.message : error)
      toast.error(error?.message)
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


  return <AskProvider value={{ isAppInstalled, onInstallApp }}>
    <Initialization />
    <Overlay />
    <Routes>
      <Route path="/" element={<NavBar />}>
        <Route index Component={Home} />
        <Route path="post/:slug/:filterCommentID" Component={ViewPostPage} />
        <Route path="ask-question" Component={AskQuestion} />
        <Route path="edit-question/:slug" Component={EditAskQuestion} />
        <Route path="find-people" Component={FindFriends} />
        <Route path="browse-question/:category/:searchInput" Component={SearchPage} />
        <Route path="responders-post" Component={RespondersSectionPage} />
        <Route path="profile/:slug" Component={Profile} />
        <Route path="edit-profile/:slug" Component={EditProfilePage} />

      </Route>

      <Route path="login" Component={LoginPage} />
      <Route path="signup" Component={SignupPage} />
      <Route path="forgotPassword" Component={ForgotPassword} />
      <Route path="reset-password" Component={ResetPassword} />
      <Route path="*" Component={NotFound} />
    </Routes>
  </AskProvider>
}

export default App;
