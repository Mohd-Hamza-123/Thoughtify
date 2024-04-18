import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import store from "./store/store.js";
import {
  RouterProvider,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import {

  AuthLayout,
} from "./components/index.js";
import { Profile, Home, EditProfilePage, AskQuestion, ViewPostPage, EditAskQuestion, PersonalChatPage, SignupPage, LoginPage, SearchPage, ForgetPassword, ResetPassword } from "./pages/pages.js";
import TrustedRespondersPage from "./pages/TrustedRespondersPage.jsx";
import FindFriends from "./pages/FindFriends.jsx";
import RespondersSectionPage from "./pages/RespondersSectionPage.jsx";


const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />}>
        <Route
          path="/"
          element={
            <>
              <Home />
            </>
          }
        />
        <Route
          path="/login"
          element={
            <AuthLayout authentication={false}>
              <LoginPage />
            </AuthLayout>
          }
        />
        <Route
          path="/forgotPassword"
          element={
            <AuthLayout authentication={false}>
              <ForgetPassword />
            </AuthLayout>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthLayout authentication={false}>
              <SignupPage />
            </AuthLayout>
          }
        />
        <Route
          path="/post/:slug/:filterCommentID"
          element={
            <>
              <ViewPostPage />
            </>
          }
        />
        <Route
          path="/trustedResponders"
          element={
            <TrustedRespondersPage />
          }
        />
        <Route
          path="/AskQuestion"
          element={
            <>
              <AskQuestion />
            </>
          }
        />

        <Route
          path="/EditQuestion/:slug"
          element={
            <>
              <EditAskQuestion />
            </>
          }
        />

        <Route
          path="/profile/:slug"
          element={
            <>
              <Profile />
            </>
          }
        />
        <Route
          path="/EditProfile/:editProfileSlug"
          element={
            <>
              <EditProfilePage />
            </>
          }
        />

        <Route
          path="/ChatRoom/:senderSlug/:receiverSlug"
          element={
            <>
              <PersonalChatPage />
            </>
          }
        />
        <Route
          path="/BrowseQuestion/:category/:searchInput"
          element={
            <>
              <SearchPage />
            </>
          }
        />

        <Route
          path="/reset-password"
          element={
            <ResetPassword />
          }
        />

        <Route
          path="/Find-People"
          element={
            <FindFriends />
          }
        />
        <Route
          path="/Responders-Section"
          element={
            <RespondersSectionPage />
          }
        />
      </Route>
    </>
  )
);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
