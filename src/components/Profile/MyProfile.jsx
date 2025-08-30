import "./MyProfile.css";
import conf from "../../conf/conf";
import { Button } from "../ui/button";
import profile from "../../appwrite/profile";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import notification from "../../appwrite/notification";
import { useNavigate, useParams } from "react-router-dom";
import { useNotificationContext } from "@/context/NotificationContext";
import {
  Opinions,
  Favourite,
  Questions,
  SecondLoader,
  ChatInProfile,
  ProfileSummary,
} from "../index";
import { useQuery } from "@tanstack/react-query";

const MyProfile = () => {

  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const authStatus = useSelector((state) => state?.auth?.status)
  const userData = useSelector((state) => state?.auth?.userData);
  const myProfile = useSelector((state) => state?.profileSlice?.userProfile)

  const { setNotification } = useNotificationContext()
  const realUser = userData ? slug === userData.$id : false;

  const [isBlocked, setisBlocked] = useState(false);

  const [activeNav, setActiveNav] = useState('Profile Summary')
  const [activeNavRender, setActiveNavRender] = useState(null)

  const { data: profileData, isPending } = useQuery({
    queryKey: ['profiles', slug],
    queryFn: async () => profile.listSingleProfile(slug),
    staleTime: Infinity,
  })

  const follow_Unfollow = async () => {

    if (!authStatus) {
      setNotification({ message: "You are not Login", type: "error" })
      return
    }

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

      setNotification({ message: "You have to Unblock to follow", type: "error" })
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
    if (!authStatus) {
      setNotification({ message: "You are not Login", type: "error" })
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
      setNotification({ message: "You have to unfollow to Block", type: "error" })
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
    setActiveNav('Profile Summary')
    setActiveNavRender(<ProfileSummary profileData={profileData} />)
  }, [slug, profileData]);

  useEffect(() => {

    switch (activeNav) {
      case 'Opinions': setActiveNavRender(<Opinions visitedProfileUserID={slug} />)
        break;
      case 'Favourites': setActiveNavRender(<Favourite visitedProfileUserID={slug} />)
        break;
      case 'Questions': setActiveNavRender(<Questions visitedUserProfile={profileData} />)
        break;
      case 'ProfileChats': setActiveNavRender(<ChatInProfile profileData={profileData || {}} />)
        break;
      default: setActiveNavRender(<ProfileSummary profileData={profileData || {}} />)
    }
  }, [activeNav])

  if (!isPending) {
    const { profileImageURL } = JSON.parse(profileData?.profileImage)
    return (<div id="MyProfile_Parent">
      <div className="MyProfile_HorizontalLine"></div>
      <div id="MyProfile" className="">
        <div id="MyProfile_Header" className={`w-full flex`}>
          <div className="w-2/3 flex">
            <div
              id="MyProfile_Img_Div"
              className="w-1/4 h-full flex justify-center items-center">
              <img src={profileImageURL?.replace("/preview", "/view")} alt="profileImage" />
            </div>
            <div
              id="MyProfile_Name_Div"
              className="w-3/4 h-full flex flex-col justify-center gap-3">
              <section className="flex flex-col items-left">
                <h6>{profileData?.name}</h6>
              </section>
              <div id="MyProfile_3Buttons" className="flex gap-3">
                {!realUser && (
                  <Button onClick={() => {
                    if (!authStatus) {
                      setNotification({ message: "You are not Login", type: "error" })
                      return
                    }

                    if (profileData.whoCanMsgYou === "None") {
                      setNotification({ message: "You can't Message", type: "error" })
                      return
                    } else if (profileData.whoCanMsgYou === "My Following") {
                      const parsingFollowingArr = profileData?.following.map((obj) => JSON.parse(obj));

                      const isHeFollowsYou = parsingFollowingArr?.find((follows) => follows?.profileID === userData?.$id);

                      if (!isHeFollowsYou) {
                        setNotification({ message: "You can't Message", type: "error" })
                        return
                      }
                    }

                    if (profileData?.blockedUsers?.includes(userData?.$id)) {
                      setNotification({ message: "You are Blocked", type: "error" })
                      return
                    }

                    navigate(`/ChatRoom/${userData?.$id}/${slug}`)
                  }} className={`p-2 rounded-sm ${isBlocked ? 'hidden' : ''}`}>Message</Button>
                )}
                {!realUser && (
                  <Button
                    className="p-2 rounded-sm"
                    onClick={follow_Unfollow}
                  >{`${true ? 'Unfollow' : 'Follow'}`}</Button>
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
                    }}>
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
          <section id="MyProfile_Data_section">
            <ul className="flex justify-between">
              <li
                onClick={() => setActiveNav('Profile Summary')}
                className={`MyProfile_Data_items ${activeNav === 'Profile Summary' ? `active` : null}`}>
                Profile Summary
              </li>

              <li
                onClick={() => setActiveNav('Questions')}
                className={`MyProfile_Data_items ${activeNav === 'Questions' ? `active` : null}`}>
                Questions
              </li>

              <li
                onClick={() => setActiveNav('Opinions')} className={`MyProfile_Data_items ${activeNav === 'Opinions' ? `active` : null}`}>
                Opinions
              </li>
              <li
                onClick={() => setActiveNav('Favourites')}
                className={`MyProfile_Data_items ${activeNav === 'Favourites' ? `active` : null} ${profileData?.userIdAuth !== userData?.$id ? 'none' : 'last-of-type:'}`}>
                Bookmarks
              </li>

              <li onClick={() => setActiveNav('ProfileChats')} className={`MyProfile_Data_items ${activeNav === 'ProfileChats' ? `active` : null}`}>
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
    </div>)
  } else {
    return <div className="w-screen h-screen flex justify-center items-center">
      <div className="MyProfile_Loader_Div">
        <SecondLoader />
      </div>
    </div>
  }

};

export default MyProfile;
