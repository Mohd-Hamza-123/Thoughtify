import { useEffect, useRef, useState } from "react";
import { AskProvider } from "./context/AskContext";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "./store/authSlice";
import { useNavigate } from "react-router-dom";
import Overlay from "./components/Overlay/Overlay";
import "./App.css";
import { Loader, SideBar } from "./components";
import appwriteService from "./appwrite/config";
import profile from "./appwrite/profile";
import { getUserProfile } from "./store/profileSlice";
import { Feedback } from "./components";
import authService from "./appwrite/auth";
import { getInitialPost } from "./store/postsSlice";
import avatar from "./appwrite/avatars";
import Setting from "./components/Setting/Setting";


function App() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isOverlayBoolean, setisOverlayBoolean] = useState(false)
  const [feedbackPopUp, setfeedbackPopUp] = useState(false);
  const [SettingPopUp, SetSettingPopUp] = useState(false);
  const [notificationPopUp, setnotificationPopUp] = useState(false)
  const [myUserProfile, setMyUserProfile] = useState(null)
  const userData = useSelector((state) => state.auth.userData)
  const [notificationShow, setNotificationShow] = useState(null)
  const [hasMorePostsInHome, sethasMorePostsInHome] = useState(true)
  const [hasMoreComments, sethasMoreComments] = useState(true)
  const [hasMorePostsInBrowseQuestions, sethasMorePostsInBrowseQuestions] = useState(true)
  const [hasMorePostsInProfileFilterQuestions, sethasMorePostsInProfileFilterQuestions] = useState(true)
  const [hasMorePostsInProfileFilterOpinions, sethasMorePostsInProfileFilterOpinions] = useState(true)
  const [hasMorePostsInProfileFilterBookmark, sethasMorePostsInProfileFilterBookmark] = useState(true)
  const [hasMorePostInTrustedPost, sethasMorePostInTrustedPost] = useState(true)
 
  const indicator = useRef(true);



  const urlParams = new URLSearchParams(window.location.search);
  const secret = urlParams.get('secret');
  const userId = urlParams.get('userId');


  useEffect(() => {
    if (userId && secret) {
      authService.verifyWithUserId_secret(userId, secret)
        .then((res) => {
          // console.log(res)
          console.log("Your email is verified")
          return authService.getCurrentUser()
        })
        .then((userData) => {
          // console.log(userData)
          dispatch(login({ userData }));
        })
        .catch((err) => {
          console.log(err)
        })
    }

  }, [])

  useEffect(() => {

    const fetchData = async () => {
      try {
        const userData = await authService.getCurrentUser();
        // console.log(userData)
        if (userData) {
          dispatch(login({ userData }))

          const userProfile = await profile.listProfile({ slug: userData?.$id });
          // console.log(userProfile)
          if (userProfile.documents.length === 0 || userProfile.total === 0) {
            // console.log("HI")
            let profileAvatar = await avatar.profileAvatar(userData?.name);
            let response = await fetch(profileAvatar.href)
            let blob = await response.blob();
            const file = new File([blob], userData.name || 'downloaded_image', { type: 'image/*' })
            const createProfileBucket = await profile.createBucket({ file })
            const getProfileURL = await profile.getStoragePreview(createProfileBucket.$id)
            const profileImgURL = getProfileURL.href;
            const userProfile = await profile.createProfile({
              name: userData?.name,
              userIdAuth: userData?.$id,
              profileImgID: createProfileBucket.$id,
              profileImgURL,
            })
            setMyUserProfile((prev) => userProfile)

            dispatch(getUserProfile({ userProfile }))
            if (userProfile) {
              navigate("/");
            } else {
              setError("Please check the credentials");
            }

          } else {

            setMyUserProfile(prev => userProfile.documents[0]);

            dispatch(getUserProfile({ userProfile: userProfile.documents[0] }));

            const profileImageID = userProfile.documents[0]?.profileImgID
            const URL = await profile.getStoragePreview(profileImageID);
            // console.log(URL)
            if (URL) {
              dispatch(getUserProfile({ userProfileImgURL: URL.href }));
            }
            navigate("/");
          }

        } else {
          // dispatch(logout());
          // navigate("/signup");
          throw new Error("User not logged in");
        }
      } catch (err) {
        // navigate("/signup");
        console.log(err);
      } finally {
        setLoading(false);

      }
    };

    if (indicator.current) {
      fetchData();
      indicator.current = false
    }

  }, []);

  useEffect(() => {
    async function getData() {
      const userData = await authService.getCurrentUser();
      const userProfile = await profile.listProfile({ slug: userData?.$id });
      setMyUserProfile(prev => userProfile?.documents[0]);
    }
    if (!myUserProfile && userData) {
      getData()
    }
  }, [userData])

  const increaseViews = async (PostId) => {
    try {
      const previesViews = await appwriteService.getPost(PostId)
      const updateViews = await appwriteService.updatePostViews(PostId, previesViews.views + 1, previesViews.commentCount);

      dispatch(getInitialPost({ initialPosts: [updateViews] }))
    } catch (error) {
      console.log("Error")
    }
  }

  return !loading ? (
    <>
      <AskProvider
        value={{
          hasMorePostsInProfileFilterBookmark,
          sethasMorePostsInProfileFilterBookmark,
          hasMorePostsInProfileFilterOpinions, sethasMorePostsInProfileFilterOpinions,
          hasMorePostsInProfileFilterQuestions,
          sethasMorePostsInProfileFilterQuestions,
          hasMorePostsInBrowseQuestions,
          sethasMorePostsInBrowseQuestions,
          hasMorePostInTrustedPost, sethasMorePostInTrustedPost,
          hasMoreComments,
          sethasMoreComments,
          hasMorePostsInHome,
          sethasMorePostsInHome,
          myUserProfile,
          setMyUserProfile,
          notificationPopUp,
          setnotificationPopUp,
          notificationShow,
          setNotificationShow,
          increaseViews,
          feedbackPopUp,
          setfeedbackPopUp,
          SettingPopUp, SetSettingPopUp,
          isOverlayBoolean, setisOverlayBoolean,
          isOpen,
          setIsOpen,
        }}
      >

        <Feedback />
        <Setting />
        <Outlet />
        <SideBar />
        <Overlay />

      </AskProvider>
    </>
  ) : <Loader />;
}

export default App;
