import "./EditProfile.css";
import { Button } from "../ui/button";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import profile from "../../appwrite/profile";
import "react-image-crop/dist/ReactCrop.css";
import { useNavigate } from 'react-router-dom'
import EditProfileBio from "./EditProfileBio";
import EditProfileTags from "./EditProfileTags";
import EditProfileImage from "./EditProfileImage";
import EditProfileLinks from "./EditProfileLinks";
import EditProfileOccupation from "./EditProfileOccupation";
import EditProfileEducationLvl from "./EditProfileEducationLvl";
import { useNotificationContext } from "@/context/NotificationContext";
import { userProfile } from "@/store/profileSlice";

const EditProfile = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch()
  const userData = useSelector((state) => state.auth.userData);
  const profileData = useSelector((state) => state.profileSlice.userProfile);
  console.log(profileData)
  const {
    $id: profileId,
    bio,
    interestedIn,
    profileImage,
    educationLvl,
    occupation,
    links,
  } = profileData

  const { profileImageURL, profileImageID } = JSON.parse(profileImage)

  const { setNotification } = useNotificationContext();


  const [isUpdating, setIsUpdating] = useState(false)
  const [profileObject, setProfileObject] = useState({
    profileImage: null,
    bio: '',
    links: [],
    educationLvl: '',
    interestedIn: [],
    occupation: '',
  })



  const submit = async (e) => {

    e.preventDefault()

    if (isUpdating) return

    const {
      profileImage,
      bio,
      links,
      educationLvl,
      interestedIn,
      occupation,
    } = profileObject


    console.log(profileObject)

    setIsUpdating(true)

    // if (!prevFileURL && !file) {
    //   setSeePreviewBefore('Make sure to see preview before uploading image')
    //   setNotification({ message: "Make sure to see preview before uploading image", type: "error" })
    //   return
    // }
    // if (seePreviewBefore !== '') {
    //   setSeePreviewBefore('Make sure to see preview before uploading image')
    //   setNotification({ message: "Make sure to see preview before uploading image", type: "error" })
    //   return
    // }

    try {

      if (profileImageID) await profile.deleteStorage(profileImageID)
      let profileImageObject = null;
      if (profileImage) {
        let uploadedPic = await profile.createBucket({ file: profileImage });
        console.log(uploadedPic)
        const profileImgURL = await profile.getStoragePreview(uploadedPic?.$id);
        profileImageObject = JSON.stringify({
          profileImageID: uploadedPic?.$id,
          profileImageURL: profileImgURL?.href
        })
      }

      console.log(profileImageObject)

      let profileData = await profile.updateProfile(
        profileId,
        {
          occupation,
          interestedIn,
          educationLvl,
          links,
          bio,
          profileImage: profileImageObject
        }
      );
      dispatch(userProfile({ userProfile: profileData }))
      console.log(profileData)
      navigate(`/profile/${userData?.$id}`);
      setNotification({ message: "Profile Updated", type: "success" })
      setIsUpdating(false)
    } catch (error) {
      setNotification({ message: "Profile not updated", type: "error" })
      console.log(error)
      setIsUpdating(false)
    }

  }


  return (
    <form
      className="h-full relative p-3 EditProfile_form"
      onSubmit={submit}>

      <EditProfileImage
        profileImageURL={profileImageURL}
        setProfileObject={setProfileObject} />

      <div
        className="w-full"
        id="EditProfile_EditContent">

        <EditProfileBio
          setProfileObject={setProfileObject}
          bio={bio}
        />

        <EditProfileLinks
          setProfileObject={setProfileObject}
          links={links}
        />

        <EditProfileEducationLvl
          educationLevel={educationLvl}
          setProfileObject={setProfileObject}
        />

        <EditProfileOccupation
          occupation={occupation}
          setProfileObject={setProfileObject}
        />

        <EditProfileTags
          interestedIn={interestedIn}
          setProfileObject={setProfileObject}
        />

      </div>

      <Button
        type="submit"
        id="EditProfile_submit_btn"
        className="flex justify-center items-center">
        {`${isUpdating ? "Updating..." : 'Update Profile'}`}
        <i className="fa-solid fa-file-arrow-up"></i>
      </Button>

    </form>
  );
};

export default EditProfile;
