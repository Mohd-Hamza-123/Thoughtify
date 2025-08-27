import { useEffect, useState } from "react";
import { AskProvider } from "./context/AskContext";
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import Overlay from "./components/Overlay/Overlay";
import "./App.css";
import { NavBar, NotificationPop, SideBar } from "./components";
import { Feedback } from "./components";
import authService from "./appwrite/auth";
import Setting from "./components/Setting/Setting";
import notification from "./appwrite/notification";
import Home from "./pages/Home";
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
import InitializationWrapper from "./Providers/InitializationWrapper";

function App() {


  const userData = useSelector((state) => state.auth?.userData);
  const authStatus = useSelector((state) => state.auth.status);

  const urlParams = new URLSearchParams(window.location.search);
  const secret = urlParams.get("secret");
  const userId = urlParams.get("userId");

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

  const verifyEmail = () => {
    if (userId && secret) {
      authService.verifyWithUserId_secret(userId, secret).then((res) => {
        if (res) {

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
    window.addEventListener("beforeinstallprompt", installApp);
    return () => {
      window.removeEventListener("beforeinstallprompt", installApp);
    };
  }, []);

  useEffect(() => {
    // if (indicator.current) {
    //   fetchData();
    //   indicator.current = false;
    // }
    if (authStatus) {
      verifyEmail();
      getNotification();
    }

  }, []);


  return <AskProvider
    value={{
      isAppInstalled,
      onInstallApp,
    }}>

    <NavBar />
    <SideBar />
    <Overlay />
    <Setting />
    <Feedback />
    <NotificationPop />
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
        path="EditProfile/:slug"
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

  </AskProvider>
}

export default App;
