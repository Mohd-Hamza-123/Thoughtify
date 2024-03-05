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
  Routes,
} from "react-router-dom";
import {
  Login,
  Signup,
  AuthLayout,
  NavBar,
  ViewPost,
  UpperNavigationBar,
} from "./components/index.js";
import { Profile, Home, EditProfilePage, AskQuestion, ViewPostPage, EditAskQuestion, PersonalChatPage, SignupPage, LoginPage, BrowseQuestions } from "./pages/pages.js";


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
          path="/signup"
          element={
            <AuthLayout authentication={false}>
              <SignupPage />
            </AuthLayout>
          }
        />
        <Route
          path="/post/:slug"
          element={
            <>
              <ViewPostPage />
            </>
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
        path="/BrowseQuestion/:category"
        element = {
          <>
          <BrowseQuestions/>
          </>
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
