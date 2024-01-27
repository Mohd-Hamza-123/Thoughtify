import React, { useEffect, useState } from "react";
import "./MyProfile.css";
import authService from "../../appwrite/auth";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, logout, editProfileInVisible } from "../../store/authSlice";
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
import { useParams } from "react-router-dom";
import profile from "../../appwrite/profile";


const MyProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);
  const [profileData, setProfileData] = useState({});

  const [countryName, setcountryName] = useState(null);
  const [flag, setflag] = useState(null);
  const [editProfileBoolean, seteditProfileBoolean] = useState(false);
  const { slug } = useParams();
  const realUser = userData ? slug === userData.$id : false;
  const [URLimg, setURLimg] = useState('')
  



  const getUserProfile = async () => {
    const listprofileData = await profile.listProfile({ slug });
    getUserProfileImg(listprofileData.documents[0].profileImgID)

    if (listprofileData) {
      setProfileData({ ...listprofileData.documents[0] });
    }
  };

  const getUserProfileImg = async (imgID) => {
    if (imgID) {
      const Preview = await profile.getStoragePreview(imgID)
      setURLimg(Preview)
    }

  }
  const flagFunc = async () => {
    let locations = await location.GetLocation();
    setcountryName(locations.country);
    if (locations) {
      let flagURL = await avatar.getFlag(locations.countryCode, 20, 20);
      setflag(flagURL.href);
    }
  };
  const getCroppedImageURL = (URL) => {
    setURLimg(URL)
  }

  useEffect(() => {
    getUserProfile();
  }, [editProfileBoolean]);

  useEffect(() => {
    flagFunc();
    // return () => getUserProfile().unsubscribe()
  });
  useEffect(() => {
    // getUserProfile()
  })

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
                src={URLimg.href || 'https://i.pinimg.com/736x/01/35/f3/0135f3c592342631da4308a8b60b98bc.jpg'}
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
                {!realUser && (
                  <Button className="p-2 rounded-sm">Message</Button>
                )}
                {!realUser && (
                  <Button className="p-2 rounded-sm">Follow</Button>
                )}
                {!realUser && <Button className="p-2 rounded-sm">Block</Button>}
                {realUser && (
                  <Button
                    className="p-2 rounded-sm"
                    onClick={() => {
                      seteditProfileBoolean((prev) => !prev);
                    }}
                  >
                    Edit Profile
                  </Button>
                )}
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
            dispatch(editProfileInVisible());
          }}
        ></div>

        <div
          id="MyProfile_EditPopup"
          className={`flex flex-col ${editProfileBoolean ? "active" : ""}`}
        >
          <EditProfile
            seteditProfileBoolean={seteditProfileBoolean}
            profileData={profileData}
            editProfileBoolean={editProfileBoolean}
            getCroppedImageURL={getCroppedImageURL}
          />
        </div>

        <div id="MyProfile_Data" className="flex mt-3">
          <section id="MyProfile_Data_section">
            <ul className="flex justify-between">
              <li onClick={() => { }} className="MyProfile_Data_items">
                Profile Summary
              </li>

              <li onClick={() => { }} className="MyProfile_Data_items">
                Questions
              </li>

              <li onClick={() => { }} className="MyProfile_Data_items">
                Opinions
              </li>
              <li onClick={() => { }} className="MyProfile_Data_items">
                Favourites
              </li>

              <li onClick={() => { }} className="MyProfile_Data_items">
                More
              </li>
            </ul>
          </section>
        </div>
        <div className="MyProfile_HorizontalLine"></div>

        <div className="w-2/3">
          <ProfileSummary profileData={profileData} />
          {/* <Favourite />
          <Opinions />
          <Questions /> */}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
