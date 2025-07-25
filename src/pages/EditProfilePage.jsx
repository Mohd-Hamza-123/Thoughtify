import "./EditProfilePage.css"
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { EditProfile, SecondLoader } from '../components/index'

const EditProfilePage = () => {
    const { slug } = useParams();
    console.log(slug)
    const [profileData, setProfileData] = useState(null);

    return (
        profileData ? (
            <div className='EditProfilePage'>
                <EditProfile
                    profileData={profileData}
                />
            </div>) : <div className='EditProfilePage flex justify-center items-center'>
            <SecondLoader />
        </div>
    )
}

export default EditProfilePage