import React, { useEffect, useState } from "react";
import "./MyProfile.css";
import authService from "../../appwrite/auth";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, logout } from "../../store/authSlice";
import {
  Favourite,
  Opinions,
  Questions,
  ProfileSummary,
  EditProfile,
  Overlay,
} from "../index";
import { Button } from "../index";
import location from "../../appwrite/location";
import avatar from "../../appwrite/avatars";

const MyProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);
  console.log(userData);
  const [countryName, setcountryName] = useState(null);
  const [flag, setflag] = useState(null);
  const [editProfileBoolean, seteditProfileBoolean] = useState(false);
  const flagFunc = async () => {
    let locations = await location.GetLocation();
    setcountryName(locations.country);
    if (locations) {
      let flagURL = await avatar.getFlag(locations.countryCode, 20, 20);
      setflag(flagURL.href);
    }
  };
  useEffect(() => {
    flagFunc();
  }, []);

  return (
    <div id="MyProfile_Parent" className="">
      <div className="MyProfile_HorizontalLine"></div>
      <div id="MyProfile" className="">
        <div id="MyProfile_Header" className="w-full flex">
          <div className="w-2/3 flex">
            <div
              id="MyProfile_Img_Div"
              className="w-1/4 h-full flex justify-center items-center"
            >
              <img
                src="https://i.pinimg.com/736x/01/35/f3/0135f3c592342631da4308a8b60b98bc.jpg"
                alt=""
              />
            </div>
            <div
              id="MyProfile_Name_Div"
              className="w-3/4 h-full flex flex-col justify-center gap-3"
            >
              <section className="flex flex-col items-left">
                <h6>{`Mohd Hamza`}</h6>
                <div>
                  <span>Gender : </span>
                  <span>{`Male`}</span>
                </div>
              </section>
              <div id="MyProfile_3Buttons" className="flex gap-3">
                <Button className="p-2 rounded-sm">Message</Button>
                <Button className="p-2 rounded-sm">Follow</Button>
                <Button className="p-2 rounded-sm">Block</Button>

                <Button
                  className="p-2 rounded-sm"
                  onClick={() => {
                    seteditProfileBoolean((prev) => !prev);
                  }}
                >
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>

          <div id="MyProfile_VerticalLine" className="h-full flex items-center">
            <p></p>
          </div>

          <div
            id="MyProfile_Header_Right"
            className="w-1/3 flex flex-col items-start justify-center gap-3 p-5"
          >
            <div className="flex w-full">
              <p className="w-1/2">Country :</p>
              <div className="flex gap-2">
                {countryName ? (
                  <span>{countryName}</span>
                ) : (
                  <span>Not Available</span>
                )}
                <span className="">{flag && <img src={flag} alt="" />}</span>
              </div>
            </div>

            <div className="flex w-full">
              <p className="w-1/2">Followers :</p>
              <span>38</span>
            </div>
            <div className="flex w-full">
              <p className="w-1/2">QueryFlow Age :</p>
              <span>4 hours</span>
            </div>
            <div className="flex w-full">
              <p className="w-1/2">Last seen :</p>
              <span>1 hour ago</span>
            </div>
          </div>
        </div>
        <div className="MyProfile_HorizontalLine"></div>

        <div
          id="MyProfile_EditPopup_overlay"
          className={`${editProfileBoolean ? "active" : ""}`}
          onClick={() => {
            seteditProfileBoolean(false);
          }}
        ></div>

        <div
          id="MyProfile_EditPopup"
          className={`flex ${editProfileBoolean ? "active" : ""}`}
        >
          <div
            id="MyProfile_EditImage_Div"
            className="w-2/6 bg-white h-full flex flex-col justify-start items-center gap-7 overflow-hidden"
          >
            <div className="flex justify-center mt-5 h-2/5">
              <img
                src="https://i.pinimg.com/736x/01/35/f3/0135f3c592342631da4308a8b60b98bc.jpg"
                alt=""
              />
            </div>
            <div className="w-full flex justify-center h-3/5">
              <label htmlFor="editProfileImg">Change Img</label>
              <input type="file" name="" id="editProfileImg" className="ml-2 hidden" />
            </div>
          </div>
          <div className="w-4/6 bg-slate-500 h-full"></div>
        </div>

        <div id="MyProfile_Data" className="flex mt-3">
          <section id="MyProfile_Data_section">
            <ul className="flex justify-between">
              <li onClick={() => {}} className="MyProfile_Data_items">
                Profile Summary
              </li>

              <li onClick={() => {}} className="MyProfile_Data_items">
                Questions
              </li>

              <li onClick={() => {}} className="MyProfile_Data_items">
                Opinions
              </li>
              <li onClick={() => {}} className="MyProfile_Data_items">
                Favourites
              </li>

              <li onClick={() => {}} className="MyProfile_Data_items">
                More
              </li>
            </ul>
          </section>
        </div>
        <div className="MyProfile_HorizontalLine"></div>

        <div className="w-2/3">
          <ProfileSummary />
          {/* <Favourite />
          <Opinions />
          <Questions /> */}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
