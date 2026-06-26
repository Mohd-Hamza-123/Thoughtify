import { Icons } from '..'
import { useSelector } from 'react-redux'
import profile from '../../appwrite/profile'
import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const ChatInProfile = ({ profileData }) => {

    const navigate = useNavigate();
    const userData = useSelector((state) => state?.auth.userData)
    const followers = Array.isArray(profileData?.followers) ? profileData.followers.map((follower) => JSON.parse(follower)) : []
    const following = Array.isArray(profileData?.following) ? profileData.following.map((following) => JSON.parse(following)) : []
    // console.log(following)

    const [activeNav, setActiveNav] = useState('Following')

    const submit = async (e) => {
        e.preventDefault()
        const value = e.target.searchValue.value
        console.log(value)
    }

    return (
        <div
            id='ChatInProfile'
            className="w-full max-w-3xl mx-auto p-4 sm:p-6 lg:p-8"
        >

            <nav className="mb-4">
                <ul className="flex items-center gap-3 border-b border-gray-200 pb-2">
                    <li
                        onClick={() => setActiveNav('Following')}
                        className={`px-5 py-2 rounded-full text-sm font-medium cursor-pointer transition-all duration-200
        ${activeNav === 'Following'
                                ? 'bg-black text-white shadow-sm scale-105'
                                : 'text-gray-600 hover:text-black hover:bg-gray-100'
                            }`}
                    >
                        Following
                    </li>

                    <li
                        onClick={() => setActiveNav('Followers')}
                        className={`px-5 py-2 rounded-full text-sm font-medium cursor-pointer transition-all duration-200
        ${activeNav === 'Followers'
                                ? 'bg-black text-white shadow-sm scale-105'
                                : 'text-gray-600 hover:text-black hover:bg-gray-100'
                            }`}
                    >
                        Followers
                    </li>
                </ul>
            </nav>


            {true && (
                <section className="mt-4 space-y-4">

                    <form
                        className="searchBar group relative"
                        onSubmit={submit}
                    >
                        <input
                            type="text"
                            name='searchValue'
                            placeholder="Search"
                            id="searchQueryInput"
                            className="w-full rounded-full border border-neutral-200 bg-white px-12 py-3 text-sm outline-none ring-0 focus:border-neutral-300 focus:ring-4 focus:ring-neutral-100 shadow-sm transition placeholder:text-neutral-400"
                        />
                        <button
                            type="submit"
                            id="searchQuerySubmit"
                            className="absolute inset-y-0 right-1 my-1 mr-1 inline-flex items-center justify-center rounded-full px-4 text-neutral-600 hover:text-neutral-900"
                        >
                            <Icons.search />
                        </button>
                    </form>

                    <div className='ChatInProfile_Two_Sections grid grid-cols-1 gap-3'>
                        {activeNav === 'Following' && (

                            <ul className="space-y-2">
                                {following.map((followingProfile) => (
                                    <li
                                        key={followingProfile?.profileID}
                                        className='flex items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-white p-3 sm:p-4 shadow-sm hover:shadow-md transition'>

                                        <Link to={`/profile/${followingProfile?.profileID}`} className="w-1/2 font-semibold">
                                            {followingProfile?.name}
                                        </Link>

                                        <button
                                            className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 active:scale-[0.98] transition">
                                            unfollow
                                        </button>
                                    </li>
                                ))}
                            </ul>

                        )}

                        {activeNav === 'Followers' && (

                            <ul className="space-y-2">
                                {followers.map((followerProfile) => (
                                    <li
                                        key={followerProfile?.profileID}
                                        className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-white p-3 sm:p-4 shadow-sm hover:shadow-md transition"
                                    >
                                        <span className="truncate font-medium text-neutral-800 dark:text-neutral-100">
                                            {followerProfile?.name}
                                        </span>
                                        <button
                                            onClick={() => navigate(`/profile/${followerProfile?.profileID}`)}
                                            className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 active:scale-[0.98] transition"
                                        >
                                            visit
                                        </button>
                                    </li>
                                ))}
                            </ul>

                        )}

                    </div>
                </section>
            )}
        </div>
    )
}

export default ChatInProfile
