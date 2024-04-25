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
import notification from "../../appwrite/notification";


const MyProfile = () => {
  const othersUserProfile = useSelector((state) => state.usersProfileSlice?.userProfileArr)
  // console.log(othersUserProfile)
  const { myUserProfile, setMyUserProfile, isDarkModeOn } = useAskContext()

  const { slug } = useParams();
  // console.log(slug)
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

  useEffect(() => {
    getOtherUserProfile(slug)
  }, [slug]);

  const getUserProfile = async (slug) => {
    const isUserAlreadyInReduxState = othersUserProfile.findIndex((user) => user.userIdAuth === slug
    )

    const index = isUserAlreadyInReduxState;
    if (isUserAlreadyInReduxState === -1) {
      // console.log("no")
      const listprofileData = await profile.listProfile({ slug });
      // console.log(listprofileData)
      if (listprofileData) {
        setProfileData({ ...listprofileData.documents[0] });
        dispatch(getOtherUserProfile({ userProfileArr: [listprofileData?.documents[0]] }))
      }
      getUserProfileImg(listprofileData?.documents[0]?.profileImgID);
    } else {
      // console.log("yes")
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
  // console.log(myUserProfile)
  const follow_Unfollow = async () => {

    if (!myUserProfile) return;

    let updateFollowArr = [...myUserProfile.following].map((obj) => JSON.parse(obj));
    // console.log(updateFollowArr)

    const isFollowing = updateFollowArr?.filter((profileObj) => profileObj.profileID === slug);


    if (isFollowing.length > 0) {


      // updating sender profile
      const findDeleteIndex = updateFollowArr.findIndex((profileObj) => profileObj.profileID === slug);
      console.log(updateFollowArr[findDeleteIndex])

      updateFollowArr.splice(findDeleteIndex, 1);
      // console.log(updateFollowArr)
      // return
      const stringifyUpdateFollowArr = updateFollowArr.map((obj) => JSON.stringify(obj));

      const follow = await profile.updateEveryProfileAttribute({
        profileID: myUserProfile.$id,
        following: stringifyUpdateFollowArr,
      });
      setMyUserProfile(follow);

      // updating receiver profile
      let receiver = await profile.listProfile({ slug });
      let receiverDetails = receiver.documents[0].followers.map((obj) => JSON.parse(obj));
      // console.log(receiverDetails);
      if (receiverDetails.length === 0) return
      receiverDetails = receiverDetails.filter((profile) => profile.profileID !== userData?.$id);
      // receiverDetails.push({ profileID: userData.$id, name: userData.name })
      receiverDetails = receiverDetails.map((obj) => JSON.stringify(obj));

      const updateReceiver = await profile.updateEveryProfileAttribute({
        profileID: receiver.documents[0].$id,
        followers: receiverDetails,
      })
      // console.log(updateReceiver)


    } else if (myUserProfile.blockedUsers.some((profileID) => profileID === slug)) {
      console.log("You have Unblock to follow");
      return;
    } else {
      console.log("fs");
      // return
      let receiver = await profile.listProfile({ slug })
      // console.log(receiver)
      updateFollowArr.push({ profileID: slug, name: receiver.documents[0].name });
      const stringifyUpdateFollowArr = updateFollowArr.map((obj) => JSON.stringify(obj));

      const follow = await profile.updateEveryProfileAttribute({
        profileID: myUserProfile.$id,
        following: stringifyUpdateFollowArr,
      });
      setMyUserProfile(follow);


      // creating notification 

      try {
        const createNotification = await notification.createNotification({ content: `${userData.name} has started following you`, isRead: false, slug: `profile/${userData.$id}`, name: userData?.name, userID: userData.$id, userIDofReceiver: slug, userProfilePic: myUserProfile?.profileImgURL });
        console.log(createNotification)
      } catch (error) {
        console.log(error)
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
      console.log(updateReceiver)
    }



  }
  const block_Unblock = async () => {
    // return
    if (!myUserProfile) return;

    const isBlocked = myUserProfile?.blockedUsers?.includes(slug);
    let updateBlockedArr = [...myUserProfile.blockedUsers];
    let updateFollowArr = [...myUserProfile.following].map((obj) => JSON.parse(obj));
    // console.log(updateFollowArr)
    let isFollowing = false;
    isFollowing = updateFollowArr.some((profile) => profile.profileID === slug)
    // console.log(isFollowing)
    // return
    if (isBlocked) {
      updateBlockedArr.splice(updateBlockedArr.indexOf(slug), 1);
      console.log("unBlock");
    } else if (isFollowing) {
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
  // console.log(isFollowing)
  const [isBlocked, setisBlocked] = useState(false);

  useEffect(() => {
    // console.log(myUserProfile)
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
    <div id="MyProfile_Parent" className={`${isDarkModeOn ? 'darkMode' : ''}`}>
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
