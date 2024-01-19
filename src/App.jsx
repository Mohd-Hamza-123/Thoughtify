import { useEffect, useState } from "react";
import { AskProvider } from "./context/AskContext";
import { Outlet } from "react-router-dom";
import { AskQue, NavBar, PostCard, MyProfile } from "./components/";
import { useDispatch } from "react-redux";
import { login, logout } from "./store/authSlice";
import { useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import authService from "./appwrite/auth";
import avatar from "./appwrite/avatars";
import location from "./appwrite/location";
import Overlay from "./components/Overlay/Overlay";
import "./App.css";

function App() {
  const [isAskQueVisible, setisAskQueVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [EditAskQueVisible, setEditAskQueVisible] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    authService
      .getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login({ userData }));
          navigate("/");
        } else {
          dispatch(logout());
          navigate("/signup");
        }
      })
      .catch((err) => {
        console.log(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
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
