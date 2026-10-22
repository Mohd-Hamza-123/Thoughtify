import "./SideBar.css";
import Icons from "../Icons";
import { toast } from "sonner";
import { ProfileImage } from "../Logo";
import authService from "../../appwrite/auth";
import { logout } from "../../store/authSlice";
import { userProfile } from "@/store/profileSlice";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setIsOverlayVisible, setIsSidebarVisible } from "@/store/booleanSlice";

const SideBar = ({ onInstallApp }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const status = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const isAppInstalled = useSelector((state) => state.booleanSlice.isAppInstalled);
  const isSidebarVisible = useSelector((state) => state.booleanSlice.isSidebarVisible);

  useEffect(() => {
    setName(status ? userData?.name || "" : "");
  }, [status, userData]);

  const closeSideBarAndOverlay = () => {
    dispatch(setIsOverlayVisible(false));
    dispatch(setIsSidebarVisible(false));
  };

  // Close on Escape key
  useEffect(() => {
    if (!isSidebarVisible) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") closeSideBarAndOverlay();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isSidebarVisible]);

  const logoutHandle = async () => {
    try {
      await authService.logout();
      dispatch(logout());
      dispatch(userProfile({ userProfile: null }));
      closeSideBarAndOverlay();
      navigate("/");
      toast.success("You have successfully logged out");
    } catch (err) {
      const message = err instanceof Error ? err.message : err;
      if (import.meta.env.DEV) console.log(message);
      toast.error("Unable to log out");
    }
  };

  const sideBarLinks = [
    {
      name: "My Profile",
      slug: `/profile/${userData?.$id}`,
      icon: <Icons.profile />,
    },
    {
      name: "Edit Profile",
      slug: `/edit-profile/${userData?.$id}`,
      icon: <Icons.edit />,
    },
    {
      name: "About Creater",
      slug: `/profile/6a1121831572c33323b2`,
      icon: <Icons.special />,
    },
  ];

  return (
    <aside
      className={`SideBar poppins ${isSidebarVisible ? "Active" : ""}`}
      aria-hidden={!isSidebarVisible}
    >
      <div className="SideBarHeader">
        <Link
          to={`/profile/${userData?.$id}`}
          onClick={closeSideBarAndOverlay}
          className="SideBarCross"
        >
          <ProfileImage />
          <p className="SideBarName poppins">{name}</p>
        </Link>

        <Icons.cross className="SideBarClose" onClick={closeSideBarAndOverlay} />
      </div>

      <nav className="SideBarContent">
        {sideBarLinks.map((option) => (
          <Link to={option.slug} key={option.name} onClick={closeSideBarAndOverlay}>
            <div className="SideBarItems">
              {option.icon}
              <p>{option.name}</p>
            </div>
          </Link>
        ))}

        {isAppInstalled && (
          <div
            className="SideBarItems"
            onClick={() => {
              closeSideBarAndOverlay();
              onInstallApp?.();
            }}
          >
            <Icons.download />
            <p>Download App</p>
          </div>
        )}

        <div className="SideBarLogout">
          <hr />
          <div className="SideBarItems" onClick={logoutHandle}>
            <Icons.logout />
            <p>LogOut</p>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default SideBar;