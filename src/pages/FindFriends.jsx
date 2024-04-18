import React, { useState } from 'react'
import { HorizontalLine, LowerNavigationBar, UpperNavigationBar } from '../components'
import NoProfile from '../assets/NoProfile.png'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import profile from '../appwrite/profile'
import { useSelector, useDispatch } from 'react-redux'
import './FindFriends.css'
import { getOtherUserProfile } from '../store/usersProfileSlice'

const FindFriends = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [searchValue, setsearchValue] = useState('')
  const userData = useSelector((state) => state.auth.userData)
  const othersUserProfile = useSelector((state) => state.usersProfileSlice?.userProfileArr)
  console.log(othersUserProfile)
  const [searchedPerson, setsearchedPerson] = useState(null);

  const { handleSubmit, reset, register } = useForm();
  const submit = async (data) => {
    try {
      const GettingName = await profile.listProfile({ name: data.searchValue })
      setsearchedPerson(GettingName?.documents[0]);
      if (GettingName?.documents[0].userIdAuth !== userData.$id) {
        dispatch(getOtherUserProfile({ userProfileArr: [GettingName?.documents[0]] }))
      }

      reset()
    } catch (error) {
      console.log(error)
    }
  }
  const nav = () => {
    navigate(`/profile/${searchedPerson?.userIDAuth}`);
  }

  return (
    <div id='FindFriendsPage'>
      <header>
        <UpperNavigationBar />
        <HorizontalLine />
        <LowerNavigationBar />
        <HorizontalLine />
      </header>
      <h3 className='FindFirendsPage_Heading text-center'>Explore New Connections </h3>
      <main className='FindFriendsPage_Main'>
        <section>
          <p>Suggestions</p>
          <div>
            {othersUserProfile?.map((profile) => (
              <div key={profile?.$id} onClick={() => navigate(`/profile/${profile?.userIdAuth}`)} className='FindFriendsPage_ListFriends cursor-pointer'>
                <div><img src={profile?.profileImgURL} /></div>
                <p>{profile?.name}</p>
              </div>
            ))}
            {othersUserProfile?.length === 0 && <div className='FindFriendsPage_ListFriends'>
              <p>No Suggestion Available</p>
            </div>}
          </div>
        </section>
        <section>

          <div className="Find_Friends_wrapper">
            <form className="Find_Friends_wrapper_searchBar" onSubmit={handleSubmit(submit)}>
              <input
                {...register("searchValue", {
                  required: true,
                })}
                className="searchQueryInput" type="text" placeholder="Enter Full Name" />
              <button className="searchQuerySubmit" type="submit" >
                <svg viewBox="0 0 24 24"><path fill="#666666" d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
                </svg>
              </button>
            </form>
          </div>

          <div>

            {searchedPerson && <div className='cursor-pointer' onClick={nav}>

              <div className='FindFriendsPage_ListFriends_Searched_Person'>
                <div className='flex gap-3 items-center'>
                  <div><img src={searchedPerson?.profileImgURL || NoProfile} /></div>
                  <p>{searchedPerson?.name}</p>
                </div>

                <div>
                  {searchedPerson?.bio}
                </div>

                <div>
                  <b>Occupation :</b>  {searchedPerson?.occupation}
                </div>

                <div className='my-1'>
                  <b>EducationLvl : </b>    {searchedPerson?.educationLvl}
                </div>

                <div className='flex gap-1'>

                  <b>Interested In :  </b>
                  <div className='flex gap-3'>
                    {searchedPerson?.interestedIn.map((interest) => (
                      <span key={interest}>{interest}</span>
                    ))
                    }
                  </div>


                </div>
              </div>
            </div>}

          </div>
        </section>
      </main>
    </div>
  )
}

export default FindFriends