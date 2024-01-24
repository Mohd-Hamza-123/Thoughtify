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
  MyProfile,
  UpperNavigationBar,
  SideBar,
  ProfileSummary,
  Opinions,
  Questions,
  Favourite,
} from "./components/index.js";
import Home from "./pages/Home.jsx";
import { Profile, AllPost } from "./pages/pages.js";

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
              <Home />
              <Login />
            </AuthLayout>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthLayout authentication={false}>
              {/* <NavBar /> */}
              <Home />
              <Signup />
            </AuthLayout>
          }
        />
        <Route
          path="/post/:slug"
          element={
            <>
              <NavBar />
              <ViewPost />
            </>
          }
        />

        <Route
          path="/profile/:slug"
          element={
            <>
              <UpperNavigationBar />
              <Profile />
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
