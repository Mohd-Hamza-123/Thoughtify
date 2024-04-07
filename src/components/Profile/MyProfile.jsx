import React, { useEffect, useState } from "react";
import "./MyProfile.css";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Favourite,
  Opinions,
  Questions,
  ProfileSummary,
  ChatInProfile,
} from "../index";
import NoProfile from '../../assets/NoProfile.png'
import { Button } from "../index";
import location from "../../appwrite/location";
import avatar from "../../appwrite/avatars";
import { useParams } from "react-router-dom";
import profile from "../../appwrite/profile";
import { useAskContext } from "../../context/AskContext";
import { getOtherUserProfile } from "../../store/usersProfileSlice";


const MyProfile = () => {
  const othersUserProfile = useSelector((state) => state.usersProfileSlice?.userProfileArr)
  // console.log(othersUserProfile)
  const { myUserProfile, setMyUserProfile } = useAskContext()
  // console.log(myUserProfile)
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
    const isUserAlreadyInReduxState = othersUserProfile.findIndex((user) => user.userIdAuth === slug
    )
    // console.log(isUserAlreadyInReduxState);
    const index = isUserAlreadyInReduxState;
    if (isUserAlreadyInReduxState === -1) {
      const listprofileData = await profile.listProfile({ slug });
      if (listprofileData) {
        setProfileData({ ...listprofileData.documents[0] });
        dispatch(getOtherUserProfile({ userProfileArr: [listprofileData.documents[0]] }))
      }
      getUserProfileImg(listprofileData.documents[0].profileImgID)
    } else {
      setProfileData((prev) => othersUserProfile[index]);
      setURLimg((prev) => othersUserProfile[index].profileImgURL)
    }

  };
  const getUserProfileImg = async (imgID) => {
    if (imgID) {
      const Preview = await profile.getStoragePreview(imgID)
      setURLimg(Preview.href)
      // console.log(Preview)
    }

  }
  const flagFunc = async () => {
    let locations = await location.GetLocation();
    setcountryName(locations?.country);
    if (locations) {
      let flagURL = await avatar.getFlag(locations.countryCode, 20, 20);
      setflag(flagURL.href);
    }
  };

  const follow_Unfollow = async () => {

    if (!myUserProfile) return;

    const isFollowing = myUserProfile?.following?.includes(slug);
    let updateFollowArr = [...myUserProfile.following];
    const receiverProfileIndex = othersUserProfile.findIndex((profile) => profile.userIdAuth === slug)


    if (isFollowing) {
      updateFollowArr.splice(updateFollowArr.indexOf(slug), 1);
      console.log("unfollow");
      const follow = await profile.updateEveryProfileAttribute({
        profileID: myUserProfile.$id,
        following: updateFollowArr,
      });
      setMyUserProfile(follow);
    } else if (myUserProfile.blockedUsers.includes(slug)) {
      console.log("You have Unblock to follow");
      return;
    } else {
      updateFollowArr.push(slug);
      const follow = await profile.updateEveryProfileAttribute({
        profileID: myUserProfile.$id,
        following: updateFollowArr,
      });
      setMyUserProfile(follow);
      let receiverDetails
      if (receiverProfileIndex !== -1) {
        receiverDetails = othersUserProfile[receiverProfileIndex]
      } else {

      }
      const updateReceiver = await profile.updateEveryProfileAttribute({
        profileID: receiverDetails?.$id,
      })
    }



  }
  const block_Unblock = async () => {

    if (!myUserProfile) return;

    const isBlocked = myUserProfile?.blockedUsers?.includes(slug);
    let updateBlockedArr = [...myUserProfile.blockedUsers];

    if (isBlocked) {
      updateBlockedArr.splice(updateBlockedArr.indexOf(slug), 1);
      console.log("unBlock");
    } else if (myUserProfile.following.includes(slug)) {
      console.log("You have to unfollow to Block");
      return;
    } else {
      updateBlockedArr.push(slug);
    }

    const follow = await profile.updateEveryProfileAttribute({
      profileID: myUserProfile.$id,
      blockedUsers: updateBlockedArr
    });

    setMyUserProfile(follow);
  }

  useEffect(() => {
    if (slug === userData?.$id) {
      setProfileData((prev) => myUserProfile);
      setURLimg(myUserProfile?.profileImgURL);
    } else {
      getUserProfile();
    }
    flagFunc();
  }, []);

  useEffect(() => {
    // console.log(activeNav)
    switch (activeNav) {
      case 'Opinions': setactiveNavRender(<Opinions visitedProfileUserID={slug} />)
        break;
      case 'Favourites': setactiveNavRender(<Favourite visitedProfileUserID={slug} />)
        break;
      case 'Questions': setactiveNavRender(<Questions visitedProfileUserID={slug} />)
        break;
      case 'ProfileChats': setactiveNavRender(<ChatInProfile profileData={profileData} />)
        break;
      default: setactiveNavRender(<ProfileSummary profileData={profileData} />)
    }
  }, [activeNav, profileData])

  const [isFollowing, setisFollowing] = useState(false)
  const [isBlocked, setisBlocked] = useState(false)
  useEffect(() => {

    if (myUserProfile.following.includes(slug)) {
      setisFollowing(true)
    } else {
      setisFollowing(false)
    }

    if (myUserProfile.blockedUsers.includes(slug)) {
      setisBlocked(true)
    } else {
      setisBlocked(false)
    }
  }, [myUserProfile])


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
              <img src={URLimg ? URLimg : NoProfile} />
            </div>
            <div
              id="MyProfile_Name_Div"
              className="w-3/4 h-full flex flex-col justify-center gap-3"
            >
              <section className="flex flex-col items-left">
                <h6>{profileData?.name}</h6>
              </section>
              <div id="MyProfile_3Buttons" className="flex gap-3">
                {!realUser && (
                  <Button onClick={() => {
                    navigate(`/ChatRoom/${userData?.$id}/${slug}`)
                  }} className={`p-2 rounded-sm ${isBlocked ? 'hidden' : ''}`}>Message</Button>
                )}
                {!realUser && (
                  <Button
                    className="p-2 rounded-sm"
                    onClick={follow_Unfollow}
                  >{`${isFollowing ? 'Unfollow' : 'Follow'}`}</Button>
                )}
                {!realUser && <Button
                  className="p-2 rounded-sm"
                  onClick={block_Unblock}
                >{isBlocked ? 'UnBlock' : 'Block'}</Button>}
                {realUser && (
                  <Button
                    className="p-2 rounded-sm"
                    onClick={() => {
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
            className="w-1/3 flex flex-col items-start justify-center gap-4 p-5"
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
              <p className="w-1/2">Joined :</p>
              <span>{new Date(profileData?.$createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
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
                Bookmarks
              </li>

              <li onClick={() => {
                setactiveNav('ProfileChats')
              }} className={`MyProfile_Data_items ${activeNav === 'ProfileChats' ? `active` : null}`}>
                Chats
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
