import React, { useState, useEffect } from 'react'
import { EditProfile, UpperNavigationBar } from '../components/index'
import profile from '../appwrite/profile'
import { useParams } from 'react-router-dom'
const EditProfilePage = () => {
    const { editProfileSlug: slug } = useParams()
    const [profileData, setProfileData] = useState({});


    const getUserProfile = async () => {
        const listprofileData = await profile.listProfile({ slug });
        if (listprofileData) {
            setProfileData({ ...listprofileData.documents[0] });
        }
    };

    const getUserProfileImg = async (imgID) => {
        if (imgID) {
            const Preview = await profile.getStoragePreview(imgID)
            setURLimg(Preview)
        }
    }


    useEffect(() => {
        getUserProfile()
    }, [])
    return (
        <>
            <UpperNavigationBar />

            <EditProfile
                profileData={profileData}
            />
        </>
    )
}

export default EditProfilePage