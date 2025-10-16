import "./MyProfile.css";
import conf from "../../conf/conf";
import { Button } from "../ui/button";
import profile from "../../appwrite/profile";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { userProfile } from "@/store/profileSlice";
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
import { followUnfollow, blockUnblock } from "@/lib/profile";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import authService from "@/appwrite/auth";
import { logout } from "@/store/authSlice";
import { NotFound } from "@/pages/pages";


const MyProfile = () => {

  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setNotification } = useNotificationContext();

  const userData = useSelector((state) => state?.auth?.userData);
  const authStatus = useSelector((state) => state?.auth?.status);
  const myProfile = useSelector((state) => state?.profileSlice?.userProfile)
  const isFollow = myProfile?.following?.find((follow) => JSON.parse(follow)?.profileID === slug)
  const isBlocked = myProfile?.blockedUsers?.includes(slug)
  const realUser = userData ? slug === userData.$id : false;

  const [isDisable, setIsDisable] = useState(false)
  const [activeNav, setActiveNav] = useState('Profile Summary');
  const [activeNavRender, setActiveNavRender] = useState(null);

  const { data: profileData, isPending, isError, isSuccess } = useQuery({
    queryKey: ['profiles', slug],
    queryFn: () => profile.listSingleProfile(slug),
    staleTime: Infinity,
  })

  const follow_Unfollow = async () => {
    setIsDisable(true)
    if (!authStatus) {
      setNotification({ message: "You are not Login", type: "error" })
      return
    }
    const newProfile = await followUnfollow({ isFollow, slug, myProfile })
    if (newProfile?.success) dispatch(userProfile({ userProfile: newProfile?.payload }))
    else setNotification({ message: newProfile?.error, type: "error" })
    setIsDisable(false)
  }
  const block_Unblock = async () => {
    setIsDisable(true)
    if (!authStatus) {
      setNotification({ message: "You are not Login", type: "error" })
      return
    }
    const newProfile = await blockUnblock({ isBlocked, slug, myProfile })
    if (newProfile?.success) dispatch(userProfile({ userProfile: newProfile?.payload }))
    else setNotification({ message: newProfile?.error, type: "error" })
    setIsDisable(false)
  }
  const promote_Demote = async () => {
    profile.updateEveryProfileAttribute({ trustedResponder: !profileData?.trustedResponder, profileID: profileData?.$id })
      .then((res) => {
        // setProfileData((prev) => res)
      })
  }
  const deleteUserAccount = async () => {

    if (slug === userData.$id) {
      authService.deleteAccount(userData.$id)
        .then((res) => {
          console.log(res)
          if (res) {
            setNotification({ message: "Account Deleted", type: "success" })
            dispatch(logout())
            navigate(`/`)
          } else {
            setNotification({ message: res.error, type: "error" })
          }
        })
        .catch((err) => {
          setNotification({ message: err.message, type: "error" })
        })
    }

  }
  const message = () => {
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
  }

  useEffect(() => {
    setActiveNav('Profile Summary')
    setActiveNavRender(<ProfileSummary profileData={profileData} />)
  }, [slug, profileData]);

  useEffect(() => {

    switch (activeNav) {
      case 'Opinions': setActiveNavRender(<Opinions visitedProfileUserID={slug} />)
        break;
      case 'bookmark': setActiveNavRender(<Favourite visitedUserProfile={profileData} />)
        break;
      case 'Questions': setActiveNavRender(<Questions visitedUserProfile={profileData} />)
        break;
      case 'ProfileChats': setActiveNavRender(<ChatInProfile profileData={profileData || {}} />)
        break;
      default: setActiveNavRender(<ProfileSummary profileData={profileData || {}} />)
    }
  }, [activeNav])

  const navLinks = [
    { name: 'Opinions', visible: true },
    { name: 'Questions', visible: true },
    { name: 'ProfileChats', visible: true },
    { name: 'Profile Summary', visible: true },
    { name: 'bookmark', visible: userData?.$id === slug },
  ]

  const userInfo = [
    { label: "Followers", value: profileData?.followers?.length },
    { label: "Following", value: profileData?.following?.length },
    { label: "Verified", value: userData?.emailVerification ? "Yes" : "No" },
    { label: "Joined", value: new Date(profileData?.$createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) },
  ]

  if (!isPending && isSuccess && profileData) {
    const { profileImageURL } = JSON.parse(profileData?.profileImage)
    return (
      <div className="bg-gray-100 dark:bg-black py-4 w-full">
        <div className="w-[95%] md:w-[85%] mx-auto">

          <section id="MyProfile_Header" className="w-full flex">

            <div className="w-2/3 flex">
              <figure
                className="w-1/4 h-full flex justify-center items-center">
                <img src={profileImageURL?.replace("/preview", "/view")} alt="profileImage" className="rounded-full h-[80%]" />
              </figure>

              <div
                id="MyProfile_Name_Div"
                className="w-3/4 h-full flex flex-col justify-center gap-3">

                <h6>{profileData?.name}</h6>

                <div id="MyProfile_3Buttons" className="flex gap-3">
                  {!realUser && <>
                    <Button onClick={message} className={`p-2 rounded-sm ${isBlocked ? 'hidden' : ''}`}>Message</Button>
                    <Button
                      disabled={isDisable}
                      className="p-2 rounded-sm"
                      onClick={follow_Unfollow}
                    >{`${isFollow ? 'Unfollow' : 'Follow'}`}</Button>
                    <Button
                      disabled={isDisable}
                      className="p-2 rounded-sm"
                      onClick={block_Unblock}
                    >{isBlocked ? 'UnBlock' : 'Block'}</Button>
                  </>}

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
                      onClick={() => promote_Demote()}>
                      {`${profileData?.trustedResponder ? "Demote" : "Promote"}`}
                    </Button>
                  )}

                  {slug === userData?.$id && <AlertDialog>
                    <AlertDialogTrigger className="px-2 py-1 rounded-sm">
                      Account Delete
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you sure , you want to delete your account ? All your data will be deleted.
                        </AlertDialogTitle>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={deleteUserAccount}>
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>}
                </div>

              </div>
            </div>

            <div
              id="MyProfile_Header_Right"
              className="w-1/3 flex flex-col items-start justify-center gap-3 p-5">
              {userInfo.map((userInfo, index) => (
                <div key={index} className="flex w-full">
                  <p className="w-1/2">{userInfo.label} :</p>
                  <span>{userInfo.value}</span>
                </div>
              ))}
            </div>

          </section>

          <section id="MyProfile_Data_section" className="my-4">
            <ul className="flex justify-between">
              {navLinks.map((navLink, index) => (
                <li key={navLink.name}
                  className={`MyProfile_Data_items ${activeNav === navLink.name ? 'active' : null}`}
                  onClick={() => setActiveNav(navLink.name)}>
                  {navLink.name}
                </li>
              ))}
            </ul>
          </section>

          <section className="w-full">{activeNavRender}</section>
        </div>
      </div>)
  }

  if (isPending)
    return <div className="w-screen h-screen flex justify-center items-center">
      <div className="MyProfile_Loader_Div">
        <SecondLoader />
      </div>
    </div>

  if (isError) return <NotFound />
}



export default MyProfile;
