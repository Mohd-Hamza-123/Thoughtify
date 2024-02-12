import React, { useEffect, useRef, useState } from "react";
import "./UpperNavigationBar.css";
import { useNavigate } from "react-router-dom";
import { useAskContext } from "../../context/AskContext";
import { Container, SideBar } from "../index";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { Input } from "../index";
import QueryFlow from "../../assets/QueryFlow.png";
import '../../index.css'
import profile from "../../appwrite/profile";


const NavigationBar = () => {
  const authStatus = useSelector((state) => state.auth.status);
  const userProfileData = useSelector((state) => state.profileSlice.userProfile)
  const BarItems = [
    {
      name: "Login",
      active: !authStatus,
      slug: "/login",
    },
    {
      name: "Sign-In",
      active: !authStatus,
      slug: "/signup",
    },
  ];
  const [profileImgURL, setprofileImgURL] = useState('')
  const upperNav = useRef();
  const navigate = useNavigate();
  const { isOpen, setIsOpen } = useAskContext();
  const userData = useSelector((state) => state.auth.userData)
  // console.log(userData)
  const getProfileData = async () => {
    const profileData = await profile.listProfile({ slug: userData?.$id })
    // console.log(profileData)
    if (profileData.documents.length > 0) {
      const profileImgID = profileData.documents[0].profileImgID
      const profileImgURL = await profile.getStoragePreview(profileImgID)
      setprofileImgURL(profileImgURL.href)
    }
  }

  useEffect(() => {
    getProfileData()
  }, [userProfileData])

  const toggleSideBar = () => {
    setIsOpen(true);
  };

  return (
    <>
      <nav
        ref={upperNav}
        id={"nav"}
        className={`flex ${isOpen ? "lightdark" : ""}`}
      >
        <Container>
          <div className="flex justify-between px-7 py-2">
            <div className={`logo_div flex justify-around`}>
              <div
                className="cursor-pointer gap-2 flex item-center"
                onClick={() => navigate("/")}
              >
                <img className={`logo`} src={QueryFlow} alt="Logo" />
                <h1 className='logo_Name'>QueryFlow</h1>
              </div>
              {/* <div>
                <div className="search_div flex">
                  <div id="search_icon_div" className="">
                    <svg
                      id="search_icon"
                      xmlns="http://www.w3.org/2000/svg"
                      height="1em"
                      viewBox="0 0 512 512"
                    >
                      <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                    </svg>
                  </div>
                  <div className="search_div_input">
                    <Input
                      id="search"
                      className={`font-bold text-black  rounded-t-none rounded-b-none`}
                      type="search"
                      placeholder="Search"
                      label=""
                    />
                  </div>
                </div>
              </div> */}
            </div>
            <ul className="flex ml-auto">
              {BarItems.map((Item) =>
                Item.active ? (
                  <li key={Item.name}>
                    <button
                      className="inline-bock px-6 py-2 duration-200 hover:bg-white hover:text-black rounded-full"
                      onClick={() => navigate(Item.slug)}
                    >
                      {Item.name}
                    </button>
                  </li>
                ) : null
              )}
            </ul>

            {true && (
              <div id="upperNavbar_svg_div" onClick={toggleSideBar}>
                <img src={profileImgURL} alt="" />
              </div>
            )}

            <SideBar />
          </div>
        </Container>
      </nav>
    </>
  );
};

export default NavigationBar;
