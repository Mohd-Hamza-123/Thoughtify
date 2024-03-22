import { useEffect, useState } from "react";
import { AskProvider } from "./context/AskContext";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "./store/authSlice";
import { useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import authService from "./appwrite/auth";
import Overlay from "./components/Overlay/Overlay";
import "./App.css";
import profile from "./appwrite/profile";
import { getUserProfile } from "./store/profileSlice";

function App() {
  const [isAskQueVisible, setisAskQueVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [EditAskQueVisible, setEditAskQueVisible] = useState(false);
  const dispatch = useDispatch();
  // const data = useSelector((state) => state.auth.status)
  // console.log(data)
  const navigate = useNavigate();

  // useEffect(() => {
  //   authService.getCurrentUser()
  //     .then((userData) => {
  //       if (userData) {
  //         dispatch(login({ userData }));
  //         navigate("/");
  //       } else {
  //         dispatch(logout());
  //         navigate("/signup");
  //       }
  //       return userData
  //     })
  //     .then((userData) => {
  //       profile.listProfile({ slug: userData?.$id })
  //         .then((res) => res.documents[0])
  //         .then((userProfile) => dispatch(getUserProfile({ userProfile })))
  //     })
  //     .catch((err) => {
  //       console.log(err.message);
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });

  // }, []);

  // Below is Optimized code by chatgpt 

  useEffect(() => {
    authService.getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login({ userData }));
          navigate("/");
          return profile.listProfile({ slug: userData?.$id });
        } else {
          dispatch(logout());
          navigate("/signup");
        }
      })
      .then((res) => res?.documents[0])
      .then((userProfile) => dispatch(getUserProfile({ userProfile })))
      .catch((err) => console.log(err.message))
      .finally(() => setLoading(false));
  }, []);


  return !loading ? (
    <>
      <AskProvider
        value={{
          isAskQueVisible,
          setisAskQueVisible,
          EditAskQueVisible,
          setEditAskQueVisible,
          isOpen,
          setIsOpen,
        }}
      >
        <Outlet />
        <Overlay />

      </AskProvider>
    </>
  ) : null;
}

export default App;
