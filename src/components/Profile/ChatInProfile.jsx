import React, { useState, useEffect, useRef } from 'react'
import './ChatInProfile.css'
import { useAskContext } from '../../context/AskContext'
import profile from '../../appwrite/profile'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
const ChatInProfile = ({ profileData }) => {
    // console.log(profileData)
    const navigate = useNavigate()

    const [activeNav, setactiveNav] = useState('Following')
    const { myUserProfile, setMyUserProfile, isDarkModeOn } = useAskContext();
    const { handleSubmit, register, control, watch, setValue, getValues } = useForm();
    const [searchValue, setSearchValue] = useState('')
    const unfollow = async (index) => {
        console.log(index);
        console.log(myUserProfile.following[index])
        let followingArr = myUserProfile.following;
        followingArr.splice(index, 1)
        // console.log(followingArr)

        const updateProfile = await profile.updateEveryProfileAttribute({ profileID: myUserProfile?.$id, following: followingArr })
        console.log(updateProfile)
        setMyUserProfile((prev) => updateProfile)
    }
    const watchedValue = watch('searchValue');

    useEffect(() => {
        setSearchValue((prev) => watchedValue)
    }, [watchedValue])

    useEffect(() => {
        setSearchValue(prev => '')
    }, [activeNav])

    const submit = async (data) => {
        console.log(data)
        setSearchValue((prev) => data.searchValue)
    }
    const navigation = (profileID) => {
        console.log(profileID)
        // return
        navigate(`/profile/${profileID}`);
    }
    return (
        <div id='ChatInProfile'>

            <nav className={`ChatInProfileNav ${isDarkModeOn ? 'darkMode' : ''}`}>
                <ul className='flex'>
                    <li onClick={() => setactiveNav('Following')} className={`${activeNav === 'Following' ? 'active' : ''} cursor-pointer`}>Following</li>
                    <li onClick={() => setactiveNav('Followers')} className={`${activeNav === 'Followers' ? 'active' : ''} cursor-pointer`}>Followers</li>
                </ul>
            </nav>

            <div className="MyProfile_HorizontalLine"></div>


            <div className="ChatInProfile_wrapper">
                <form className="searchBar" onSubmit={handleSubmit(submit)}>
                    <input
                        {...register("searchValue", {
                            required: true,
                        })}
                        id="searchQueryInput" type="text" placeholder="Search" value={searchValue} />
                    <button id="searchQuerySubmit" type="submit" >
                        <svg viewBox="0 0 24 24"><path fill="#666666" d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
                        </svg>
                    </button>
                </form>
            </div>

            <div className='ChatInProfile_Two_Sections'>

                {activeNav === 'Following' && <section>
                    <ul>
                        {myUserProfile?.following?.map((profile, index) => {
                            if (searchValue !== '') {
                                let boolean = JSON.parse(profile)?.name.includes(searchValue);
                                // console.log(boolean)
                                if (boolean && searchValue !== '') {
                                } else {
                                    return
                                }
                            }
                            return <li key={JSON.parse(profile).profileID}>
                                <span onClick={() => navigation(JSON.parse(profile).profileID)}>{JSON.parse(profile).name}</span>
                                <button onClick={() => unfollow(index)}>Unfollow</button>
                            </li>
                        })}
                        {myUserProfile?.following?.length === 0 && <div className={`${isDarkModeOn ? 'text-white' : 'text-black'} text-center`}>No Followers</div>}
                    </ul>
                </section>}

                {activeNav === 'Followers' && <section>
                    <ul>
                        {myUserProfile?.followers?.map((profile, index) => {
                            if (searchValue !== '') {
                                let boolean = JSON.parse(profile)?.name.includes(searchValue);
                                console.log(boolean)
                                if (boolean && searchValue !== '') {
                                } else {
                                    return
                                }
                            }

                            return <li key={JSON.parse(profile).profileID}>
                                <span className='cursor-auto'>{JSON.parse(profile).name}</span>
                                <button onClick={() => navigation(JSON.parse(profile).profileID)}>Visit</button>
                            </li>
                        })}
                        {myUserProfile?.followers?.length === 0 && <div className={`${isDarkModeOn ? 'text-white' : 'text-black'} text-center`}>No Followers</div>}
                    </ul>
                </section>}

            </div>
        </div >
    )
}

export default ChatInProfile