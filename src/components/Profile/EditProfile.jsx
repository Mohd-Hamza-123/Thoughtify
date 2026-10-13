import { toast } from "sonner";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import React, { useState } from "react";
import profile from "../../appwrite/profile";
import "react-image-crop/dist/ReactCrop.css";
import { useNavigate } from 'react-router-dom'
import EditProfileBio from "./EditProfileBio";
import EditProfileTags from "./EditProfileTags";
import EditProfileImage from "./EditProfileImage";
import EditProfileLinks from "./EditProfileLinks";
import { userProfile } from "@/store/profileSlice";
import { useSelector, useDispatch } from "react-redux";
import EditProfileOccupation from "./EditProfileOccupation";
import EditProfileEducationLvl from "./EditProfileEducationLvl";
import { useQuery, useQueryClient } from "@tanstack/react-query"

const EditProfile = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const userData = useSelector((state) => state.auth.userData);
  const profileData = useSelector((state) => state.profileSlice.userProfile);
  // console.log(profileData)

  const [isUpdating, setIsUpdating] = useState(false)
  const [profileObject, setProfileObject] = useState({
    profileImage: null,
    bio: '',
    links: [],
    educationLvl: '',
    interestedIn: [],
    occupation: '',
  })

  // const profileData = queryClient.getQueryData(['profiles', userData.$id])

  console.log(profileData)

  const {
    bio,
    links,
    occupation,
    interestedIn,
    educationLvl,
    profileImage,
    $id: profileId,
  } = profileData
  const { profileImageURL, profileImageID } = JSON.parse(profileImage)


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


    // console.log(profileObject)

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
        // console.log(uploadedPic)
        const profileImgURL = await profile.getStoragePreview(uploadedPic?.$id);
        profileImageObject = JSON.stringify({
          profileImageID: uploadedPic?.$id,
          profileImageURL: profileImgURL?.href
        })
      }

      // console.log(profileImageObject)

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
      queryClient.invalidateQueries(['profiles', userData?.$id]) // It marks cache as stale and usually triggers a refetch.
      navigate(`/profile/${userData?.$id}`);
      setIsUpdating(false)

    } catch (error) {
      toast.error("Profile not updated")
      console.log(error)
      setIsUpdating(false)
    }

  }



  return (
    <form
      onSubmit={submit}
      className="relative w-full min-h-full px-4 py-6 sm:px-6 lg:px-10"
    >
      <div className="mx-auto flex w-full max-w-[900px] flex-col gap-8 pb-24">
        <EditProfileImage
          profileImageURL={profileImageURL}
          setProfileObject={setProfileObject}
        />

        <div className="flex w-full flex-col gap-6">
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
      </div>

      <div className="fixed bottom-4 left-0 z-20 flex w-full justify-center px-4">
        {isUpdating ? <Spinner /> : <Button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-md bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-sky-600 disabled:opacity-70">
          Update Profile
        </Button>}
      </div>
    </form>
  );
};

export default EditProfile;
