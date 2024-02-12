import React, { useEffect, useState } from "react";
import "./MyProfile.css";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Favourite,
  Opinions,
  Questions,
  ProfileSummary,
} from "../index";
import { Button } from "../index";
import location from "../../appwrite/location";
import avatar from "../../appwrite/avatars";
import { useParams } from "react-router-dom";
import profile from "../../appwrite/profile";


const MyProfile = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);
  const realUser = userData ? slug === userData.$id : false;
  const [profileData, setProfileData] = useState({});
  const [countryName, setcountryName] = useState(null);
  const [flag, setflag] = useState(null);
  const [URLimg, setURLimg] = useState('')
  const [activeNav, setactiveNav] = useState('Profile Summary')
  const [activeNavRender, setactiveNavRender] = useState(<ProfileSummary profileData={profileData} />)
  // console.log(activeNavRender)

  const getUserProfile = async () => {
    const listprofileData = await profile.listProfile({ slug });
    // console.log(listprofileData)
    if (listprofileData) {
      setProfileData({ ...listprofileData.documents[0] });
    }
    getUserProfileImg(listprofileData.documents[0].profileImgID)
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

  useEffect(() => {
    getUserProfile();
    flagFunc();
  }, []);

  useEffect(() => {
    // console.log(activeNav)
    switch (activeNav) {
      case 'Opinions': setactiveNavRender(<Opinions />)
        break;
      case 'Favourites': setactiveNavRender(<Favourite />)
        break;
      case 'Questions': setactiveNavRender(<Questions />)
        break;
      default: setactiveNavRender(<ProfileSummary profileData={profileData} />)
    }
  }, [activeNav, profileData])


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
                <h6>{profileData?.name}</h6>
                <div>
                  <span>Gender : </span>
                  <span>{profileData?.gender}</span>
                </div>
              </section>
              <div id="MyProfile_3Buttons" className="flex gap-3">
                {!realUser && (
                  <Button onClick={() => {
                    navigate(`/ChatRoom/${userData?.$id}/${slug}`)
                  }} className="p-2 rounded-sm">Message</Button>
                )}
                {!realUser && (
                  <Button className="p-2 rounded-sm">Follow</Button>
                )}
                {!realUser && <Button className="p-2 rounded-sm">Block</Button>}
                {realUser && (
                  <Button
                    className="p-2 rounded-sm"
                    onClick={() => {
                      // seteditProfileBoolean((prev) => !prev);
                      navigate(`/EditProfile/${slug}`)
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


        <div id="MyProfile_Data" className="flex mt-3">
          <section id="MyProfile_Data_section">
            <ul className="flex justify-between">
              <li
                onClick={() => {
                  setactiveNav('Profile Summary')
                }}
                className={`MyProfile_Data_items ${activeNav === 'Profile Summary' ? `active` : null}`}>
                Profile Summary
              </li>

              <li
                onClick={() => {
                  setactiveNav('Questions')
                }}
                className={`MyProfile_Data_items ${activeNav === 'Questions' ? `active` : null}`}>
                Questions
              </li>

              <li
                onClick={() => { setactiveNav('Opinions') }} className={`MyProfile_Data_items ${activeNav === 'Opinions' ? `active` : null}`}>
                Opinions
              </li>
              <li
                onClick={() => {
                  setactiveNav('Favourites')
                }}
                className={`MyProfile_Data_items ${activeNav === 'Favourites' ? `active` : null}`}>
                Favourites
              </li>

              <li onClick={() => { }} className="MyProfile_Data_items">
                More
              </li>
            </ul>
          </section>
        </div>

        <div className="MyProfile_HorizontalLine"></div>

        <div className="w-full">
          {activeNavRender}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
