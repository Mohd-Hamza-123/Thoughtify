import React, { useEffect, useState } from "react";
import "./MyProfile.css";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Favourite,
  Opinions,
  Questions,
  ProfileSummary,
  ChatInProfile,
  SecondLoader,
} from "../index";
import NoProfile from '../../assets/NoProfile.png'
import { Button } from "../index";
import location from "../../appwrite/location";
import avatar from "../../appwrite/avatars";
import { useParams } from "react-router-dom";
import profile from "../../appwrite/profile";
import { useAskContext } from "../../context/AskContext";
import { getOtherUserProfile } from "../../store/usersProfileSlice";
import notification from "../../appwrite/notification";
import conf from "../../conf/conf";


const MyProfile = () => {

  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const othersUserProfile = useSelector((state) => state?.usersProfileSlice?.userProfileArr);

  const userData = useSelector((state) => state?.auth?.userData);
  const UserAuthStatus = useSelector((state) => state?.auth?.status)
  const {
    myUserProfile,
    setMyUserProfile,
    isDarkModeOn,
    setnotificationPopMsg,
    setNotificationPopMsgNature, } = useAskContext();

  const realUser = userData ? slug === userData.$id : false;

  const [profileData, setProfileData] = useState(null);

  const [countryName, setcountryName] = useState(null);
  const [flag, setflag] = useState(null);
  const [URLimg, setURLimg] = useState('')
  const [isFollowing, setisFollowing] = useState(false)

  const [isBlocked, setisBlocked] = useState(false);
  const [activeNav, setactiveNav] = useState('Profile Summary')
  const [activeNavRender, setactiveNavRender] = useState(<ProfileSummary profileData={profileData || {}} />)


  const getUserProfile = async (slug) => {
    const isUserAlreadyInReduxState = othersUserProfile.findIndex((user) => user.userIdAuth === slug
    )

    const index = isUserAlreadyInReduxState;
    if (isUserAlreadyInReduxState === -1) {

      const listprofileData = await profile.listProfile({ slug });

      if (listprofileData) {
        setProfileData({ ...listprofileData.documents[0] });
        dispatch(getOtherUserProfile({ userProfileArr: [listprofileData?.documents[0]] }))
      }
      getUserProfileImg(listprofileData?.documents[0]?.profileImgID);
    } else {

      setProfileData((prev) => othersUserProfile[index]);
      setURLimg((prev) => othersUserProfile[index].profileImgURL)
    }

  };
  const getUserProfileImg = async (imgID) => {
    if (imgID) {
      const Preview = await profile.getStoragePreview(imgID)
      setURLimg(Preview.href)
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

    if (!UserAuthStatus) {
      setNotificationPopMsgNature((prev) => false);
      setnotificationPopMsg((prev) => 'You are not Login')
      return
    }
    if (!myUserProfile) return;
    setisFollowing((prev) => !prev);
    let updateFollowArr = [...myUserProfile.following].map((obj) => JSON.parse(obj));


    const isFollowing = updateFollowArr?.filter((profileObj) => profileObj.profileID === slug);


    if (isFollowing.length > 0) {


      // updating sender profile
      const findDeleteIndex = updateFollowArr.findIndex((profileObj) => profileObj.profileID === slug);
      console.log(updateFollowArr[findDeleteIndex])

      updateFollowArr.splice(findDeleteIndex, 1);

      const stringifyUpdateFollowArr = updateFollowArr.map((obj) => JSON.stringify(obj));

      const follow = await profile.updateEveryProfileAttribute({
        profileID: myUserProfile.$id,
        following: stringifyUpdateFollowArr,
      });
      setMyUserProfile(follow);

      // updating receiver profile
      let receiver = await profile.listProfile({ slug });
      let receiverDetails = receiver.documents[0].followers.map((obj) => JSON.parse(obj));

      if (receiverDetails.length === 0) return
      receiverDetails = receiverDetails.filter((profile) => profile.profileID !== userData?.$id);

      receiverDetails = receiverDetails.map((obj) => JSON.stringify(obj));

      const updateReceiver = await profile.updateEveryProfileAttribute({
        profileID: receiver.documents[0].$id,
        followers: receiverDetails,
      })



    } else if (myUserProfile.blockedUsers.some((profileID) => profileID === slug)) {

      setNotificationPopMsgNature((prev) => false);
      setnotificationPopMsg((prev) => "You have to Unblock to follow")
      return;
    } else {

      let receiver = await profile.listProfile({ slug })

      updateFollowArr.push({ profileID: slug, name: receiver.documents[0].name });
      const stringifyUpdateFollowArr = updateFollowArr.map((obj) => JSON.stringify(obj));

      const follow = await profile.updateEveryProfileAttribute({
        profileID: myUserProfile.$id,
        following: stringifyUpdateFollowArr,
      });
      setMyUserProfile(follow);

      try {
        const createNotification = await notification.createNotification({ content: `${userData.name} has started following you`, isRead: false, slug: `profile/${userData.$id}`, name: userData?.name, userID: userData.$id, userIDofReceiver: slug, userProfilePic: myUserProfile?.profileImgURL });
        console.log(createNotification)
      } catch (error) {

      }


      // updating receiver profile

      let receiverDetails = receiver.documents[0].followers.map((obj) => JSON.parse(obj))
      console.log(receiverDetails);
      receiverDetails.push({ profileID: userData.$id, name: userData.name })
      receiverDetails = receiverDetails.map((obj) => JSON.stringify(obj));

      const updateReceiver = await profile.updateEveryProfileAttribute({
        profileID: receiver.documents[0].$id,
        followers: receiverDetails,
      })

    }



  }
  const block_Unblock = async () => {
    if (!UserAuthStatus) {
      setNotificationPopMsgNature((prev) => false);
      setnotificationPopMsg((prev) => 'You are not Login')
      return
    }
    if (!myUserProfile) return;



    const isBlocked = myUserProfile?.blockedUsers?.includes(slug);
    let updateBlockedArr = [...myUserProfile.blockedUsers];
    let updateFollowArr = [...myUserProfile.following].map((obj) => JSON.parse(obj));

    let isFollowing = false;
    isFollowing = updateFollowArr.some((profile) => profile.profileID === slug)

    if (isBlocked) {
      updateBlockedArr.splice(updateBlockedArr.indexOf(slug), 1);
      console.log("unBlock");
      setisBlocked((prev) => !prev)
    } else if (isFollowing) {
      setNotificationPopMsgNature((prev) => false)
      setnotificationPopMsg((prev) => "You have to unfollow to Block")
      return;
    } else {
      setisBlocked((prev) => !prev)
      updateBlockedArr.push(slug);
    }

    const follow = await profile.updateEveryProfileAttribute({
      profileID: myUserProfile.$id,
      blockedUsers: updateBlockedArr
    });

    setMyUserProfile(follow);
  }
  const promote_Demote = async () => {
    console.log(profileData);
    profile.updateEveryProfileAttribute({ trustedResponder: !profileData?.trustedResponder, profileID: profileData?.$id })
      .then((res) => {
        setProfileData((prev) => res)
      })
  }

  useEffect(() => {

    setactiveNav((prev) => 'Profile Summary')

    if (slug === userData?.$id) {
      setProfileData((prev) => myUserProfile);
      setURLimg(myUserProfile?.profileImgURL);
    } else {
      getUserProfile(slug);
    }
    flagFunc();
  }, [slug]);

  useEffect(() => {

    switch (activeNav) {
      case 'Opinions': setactiveNavRender(<Opinions visitedProfileUserID={slug} />)
        break;
      case 'Favourites': setactiveNavRender(<Favourite visitedProfileUserID={slug} />)
        break;
      case 'Questions': setactiveNavRender(<Questions visitedProfileUserID={slug} />)
        break;
      case 'ProfileChats': setactiveNavRender(<ChatInProfile profileData={profileData || {}} setProfileData={setProfileData} />)
        break;
      default: setactiveNavRender(<ProfileSummary profileData={profileData || {}} />)
    }
  }, [activeNav, profileData])


  useEffect(() => {

    if (!myUserProfile) {
      profile
        .listProfile({ slug })
        .then((res) => {
          setMyUserProfile(res?.documents[0])
        })
      return
    }

    if (Array.isArray(myUserProfile.following) === false) return

    const parseMyUserProfile = myUserProfile.following.map(obj => JSON.parse(obj));
    const receiverProfile = parseMyUserProfile.filter(obj => obj.profileID === slug);
    setisFollowing(receiverProfile.length > 0);

    if (myUserProfile.blockedUsers.includes(slug)) {
      setisBlocked(true)
    } else {
      setisBlocked(false)
    }
  }, [myUserProfile, slug])


  return (
    profileData ?
      (<div id="MyProfile_Parent" className={`${isDarkModeOn ? 'darkMode' : ''}`}>
        <div className="MyProfile_HorizontalLine"></div>
        <div id="MyProfile" className="">
          <div id="MyProfile_Header" className={`w-full flex ${isDarkModeOn ? 'darkMode' : ''}`}>
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
                      if (!UserAuthStatus) {
                        setNotificationPopMsgNature((prev) => false);
                        setnotificationPopMsg((prev) => 'You are not Login')
                        return
                      }

                      if (profileData.whoCanMsgYou === "None") {
                        setNotificationPopMsgNature((prev) => false);
                        setnotificationPopMsg((prev) => "You can't Message");
                        return
                      } else if (profileData.whoCanMsgYou === "My Following") {
                        const parsingFollowingArr = profileData?.following.map((obj) => JSON.parse(obj));

                        const isHeFollowsYou = parsingFollowingArr?.find((follows) => follows?.profileID === userData?.$id);

                        if (!isHeFollowsYou) {
                          setNotificationPopMsgNature((prev) => false);
                          setnotificationPopMsg((prev) => "You can't Message");
                          return
                        }
                      }

                      if (profileData?.blockedUsers?.includes(userData?.$id)) {
                        setNotificationPopMsgNature((prev) => false);
                        setnotificationPopMsg((prev) => "You are Blocked");
                        return
                      }

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
                  {(userData?.$id === conf.myPrivateUserID) && (
                    <Button
                      className="p-2 rounded-sm"
                      onClick={() => promote_Demote()}
                    >
                      {`${profileData?.trustedResponder ? "Demote" : "Promote"}`}
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
                <span>{profileData?.followers?.length}</span>
              </div>
              <div className="flex w-full">
                <p className="w-1/2">Following :</p>
                <span>{profileData?.following?.length}</span>
              </div>
              <div className="flex w-full">
                <p className="w-1/2">Joined :</p>
                <span>{new Date(profileData?.$createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              {(profileData?.userIdAuth === userData?.$id) && <div className="flex w-full">
                <p className="w-1/2">Verified : </p>
                <span>{userData?.emailVerification ? "Yes" : "No"}</span>
              </div>}

            </div>
          </div>
          <div className="MyProfile_HorizontalLine"></div>


          <div id="MyProfile_Data" className="flex mt-3">
            <section id="MyProfile_Data_section" className={`${isDarkModeOn ? 'darkMode' : ''}`}>
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
                  className={`MyProfile_Data_items ${activeNav === 'Favourites' ? `active` : null} ${profileData?.userIdAuth !== userData?.$id ? 'none' : 'last-of-type:'}`}>
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
      </div>) : (
        <div className="w-screen h-screen flex justify-center items-center">
          <div className="MyProfile_Loader_Div">
            <SecondLoader />
          </div>
        </div>)
  );
};

export default MyProfile;
