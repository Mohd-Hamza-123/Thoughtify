import React, { useState, useEffect } from 'react'
import { EditProfile, SecondLoader, UpperNavigationBar } from '../components/index'
import profile from '../appwrite/profile'
import { useParams } from 'react-router-dom'
import { useAskContext } from '../context/AskContext'
import { useSelector } from 'react-redux'
import "./EditProfilePage.css"

const EditProfilePage = () => {
    const { editProfileSlug: slug } = useParams();
    const [profileData, setProfileData] = useState(null);
    const { myUserProfile } = useAskContext();
    const userData = useSelector((state) => state.auth.userData)


    const getUserProfile = async () => {
        if (slug !== userData.$id) return

        if (myUserProfile?.userIdAuth === slug) {
            setProfileData(myUserProfile);
        } else {
            const listprofileData = await profile.listProfile({ slug });
            if (listprofileData) {
                setProfileData({ ...listprofileData?.documents[0] });
            }
        }

    };


    useEffect(() => {
        getUserProfile();
    }, []);
    return (
        profileData ? (
            <div className='EditProfilePage'>
                <UpperNavigationBar />
                <EditProfile
                    profileData={profileData}
                />
            </div>) : <div className='EditProfilePage flex justify-center items-center'>
            <SecondLoader />
        </div>
    )
}

export default EditProfilePage