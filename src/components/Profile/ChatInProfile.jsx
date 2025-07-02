import React, { useState, useEffect } from 'react'
import profile from '../../appwrite/profile'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Icons } from '..'

const ChatInProfile = ({ profileData }) => {

    const userData = useSelector((state) => state?.auth.userData)
    const navigate = useNavigate();
    const followers = Array.isArray(profileData?.followers) ? profileData.followers.map((follower) => JSON.parse(follower)) : []
    const following = Array.isArray(profileData?.following) ? profileData.following.map((following) => JSON.parse(following)) : []
    console.log(followers)
    console.log(following)
    const [activeNav, setActiveNav] = useState('Following')

    const submit = async (form) => {
        const formData = new FormData(form)
        const searchValue = formData.searchValue
    }

    const navigation = (profileID) => {
        navigate(`/profile/${profileID}`);
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
                        onSubmit={(e) => submit(e.target)}
                    >
                        <input
                            id="searchQueryInput"
                            type="text"
                            placeholder="Search"
                            name='searchValue'
                            className="w-full rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-12 py-3 text-sm outline-none ring-0 focus:border-neutral-300 dark:focus:border-neutral-700 focus:ring-4 focus:ring-neutral-100 dark:focus:ring-neutral-800/50 shadow-sm transition placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
                        />
                        <button
                            id="searchQuerySubmit"
                            type="submit"
                            className="absolute inset-y-0 right-1 my-1 mr-1 inline-flex items-center justify-center rounded-full px-4 text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white transition"
                        >
                            <Icons.search />
                        </button>
                    </form>

                    <div className='ChatInProfile_Two_Sections grid grid-cols-1 gap-3'>

                        {activeNav === 'Following' && (
                            <section className="space-y-2">
                                <ul className="space-y-2">
                                    {following.map((followingProfile) => (
                                        <li
                                            key={followingProfile?.profileID}
                                            className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-3 sm:p-4 shadow-sm hover:shadow-md transition"
                                        >
                                            <span className="truncate font-medium text-neutral-800 dark:text-neutral-100">
                                                {followingProfile?.name}
                                            </span>
                                            <button
                                                className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 py-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 active:scale-[0.98] transition"
                                            >
                                                unfollow
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {activeNav === 'Followers' && (
                            <section className="space-y-2">
                                <ul className="space-y-2">
                                    {followers.map((followerProfile) => (
                                        <li
                                            key={followerProfile?.profileID}
                                            className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-3 sm:p-4 shadow-sm hover:shadow-md transition"
                                        >
                                            <span className="truncate font-medium text-neutral-800 dark:text-neutral-100">
                                                {followerProfile?.name}
                                            </span>
                                            <button
                                                className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 py-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 active:scale-[0.98] transition"
                                            >
                                                Message
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                    </div>
                </section>
            )}
        </div>
    )
}

export default ChatInProfile
