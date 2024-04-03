import { useEffect, useState } from "react";
import { AskProvider } from "./context/AskContext";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "./store/authSlice";
import { useNavigate } from "react-router-dom";
import Overlay from "./components/Overlay/Overlay";
import "./App.css";
import {SideBar} from "./components";
import appwriteService from "./appwrite/config";
import profile from "./appwrite/profile";
import { getUserProfile } from "./store/profileSlice";
import { Feedback } from "./components";
import authService from "./appwrite/auth";
import { getInitialPost } from "./store/postsSlice";



function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [feedbackPopUp, setfeedbackPopUp] = useState(false);
  const [notificationPopUp, setnotificationPopUp] = useState(false)
  const [myUserProfile, setMyUserProfile] = useState({})
  const [hasMorePostsInHome, sethasMorePostsInHome] = useState(true)
  const [hasMoreComments, sethasMoreComments] = useState(true)
  const [hasMorePostsInBrowseQuestions, sethasMorePostsInBrowseQuestions] = useState(true)
  const [hasMorePostsInProfileFilterQuestions, sethasMorePostsInProfileFilterQuestions] = useState(true)
  const [hasMorePostsInProfileFilterOpinions, sethasMorePostsInProfileFilterOpinions] = useState(true)


  useEffect(() => {

    authService.getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login({ userData }));
          navigate("/");
          return profile.listProfile({ slug: userData?.$id });
        } else {
          dispatch(logout());
          navigate("/signup");
        }
      })
      .then((res) => res?.documents[0])
      .then((userProfile) => {
        setMyUserProfile((prev) => userProfile)
        dispatch(getUserProfile({ userProfile }))
        return userProfile.profileImgID
      })
      .then((profileImgID) => {
        return profile.getStoragePreview(profileImgID)
      })
      .then((URL) => {
        if (URL) dispatch(getUserProfile({ userProfileImgURL: URL.href }))
      })
      .catch((err) => {
        navigate("/signup");

        console.log(err)
      }
      )
      .finally(() => setLoading(false));
  }, []);

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
          hasMorePostsInProfileFilterOpinions, sethasMorePostsInProfileFilterOpinions,
          hasMorePostsInProfileFilterQuestions,
          sethasMorePostsInProfileFilterQuestions,
          hasMorePostsInBrowseQuestions,
          sethasMorePostsInBrowseQuestions,
          hasMoreComments,
          sethasMoreComments,
          hasMorePostsInHome,
          sethasMorePostsInHome,
          myUserProfile,
          setMyUserProfile,
          notificationPopUp,
          setnotificationPopUp,
          increaseViews,
          feedbackPopUp,
          setfeedbackPopUp,
          isOpen,
          setIsOpen,
        }}
      >

        <Feedback />
        <Outlet />
        <SideBar />
        <Overlay />
      </AskProvider>
    </>
  ) : null;
}

export default App;
