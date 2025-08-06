import "./EditProfile.css";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import profile from "../../appwrite/profile";
import "react-image-crop/dist/ReactCrop.css";
import { useNavigate } from 'react-router-dom'
import EditProfileBio from "./EditProfileBio";
import EditProfileTags from "./EditProfileTags";
import EditProfileImage from "./EditProfileImage";
import EditProfileLinks from "./EditProfileLinks";
import * as imageConversion from 'image-conversion'
import React, { useState } from "react";
import EditProfileOccupation from "./EditProfileOccupation";
import EditProfileEducationLvl from "./EditProfileEducationLvl";
import { useNotificationContext } from "@/context/NotificationContext";

const EditProfile = () => {

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const profileData = useSelector((state) => state.profileSlice.userProfile);


  const {
    bio,
    interestedIn,
    profileImage,
    educationLvl,
    occupation,
    links,
  } = profileData


  const { profileImageURL, profileImageID } = JSON.parse(profileImage)


  const { setNotification } = useNotificationContext();

  const [profileObject, setProfileObject] = useState({
    profileImage: null,
    bio: '',
    links: [],
    educationLvl: '',
  })
  console.log(profileObject)

  const [isUpdating, setIsUpdating] = useState(false)

  const submit = async (data) => {

    setIsUpdating((prev) => true)

    if (!prevFileURL && !file) {
      setSeePreviewBefore('Make sure to see preview before uploading image')
      setNotification({ message: "Make sure to see preview before uploading image", type: "error" })
      return
    }
    if (seePreviewBefore !== '') {
      setSeePreviewBefore('Make sure to see preview before uploading image')
      setNotification({ message: "Make sure to see preview before uploading image", type: "error" })
      return
    }

    if (file) {

      if (profileImageID) await profile.deleteStorage(profileImageID)

      let blob = await imageConversion.compressAccurately(file, 200)

      let uploadFile = new File([blob], userData?.name, { type: blob.type });

      if (!uploadFile) return
      let uploadedPic = await profile.createBucket({ file: uploadFile });
      if (!uploadedPic) {
        setNotification({ message: "Profile Updation failed", type: "error" })
        setIsUpdating((prev) => false)
        return
      }

      const profileImgURL = await profile.getStoragePreview(uploadedPic?.$id)
      if (profileImgURL) {
        data.profileImgURL = profileImgURL?.href
        data.profileImgID = `${uploadedPic?.$id}`
      }


    } else {
      data.profileImgID = profileImgID
    }

    if (data) {
      if (data.educationLvl) {
        if (data.occupation) {
          let profileData = await profile.updateProfile(
            $id,
            { ...data },
            linksArr,
            interestedTagArr,
          );
          setMyUserProfile(profileData)
        } else {
          let profileData = await profile.updateProfile(
            $id,
            { ...data, occupation: OccupationInput },
            linksArr,
            interestedTagArr,
          );
          setMyUserProfile(profileData)
        }
      } else {
        if (data.occupation) {
          let profileData = await profile.updateProfile(
            $id,
            { ...data, educationLvl: EducationLevel },
            linksArr,
            interestedTagArr,
          );
          setMyUserProfile(profileData)
        } else {
          let profileData = await profile.updateProfile(
            $id,
            {
              ...data,
              occupation: OccupationInput,
              educationLvl: EducationLevel,
            },
            linksArr,
            interestedTagArr,
          );
          setMyUserProfile(profileData);
        }
      }
      navigate(`/profile/${userData?.$id}`);
      setSeePreviewBefore('')
      setNotification({ message: "Profile Updated", type: "success" })
      setIsUpdating((prev) => false)
    }
  };

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
