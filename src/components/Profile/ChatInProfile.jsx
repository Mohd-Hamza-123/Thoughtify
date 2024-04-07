import React, { useState, useEffect } from 'react'
import './ChatInProfile.css'
const ChatInProfile = ({ profileData }) => {
    console.log(profileData)
    const [activeNav, setactiveNav] = useState('Following')
    const [activeNavRender, setactiveNavRender] = useState()

    
    return (
        <div id='ChatInProfile'>

            <nav className='ChatInProfileNav'>
                <ul className='flex'>
                    <li onClick={() => setactiveNav('Following')} className={`${activeNav === 'Following' ? 'active' : ''} cursor-pointer`}>Following</li>
                    <li onClick={() => setactiveNav('Followers')} className={`${activeNav === 'Followers' ? 'active' : ''} cursor-pointer`}>Followers</li>
                    <li onClick={() => setactiveNav('Others')} className={`${activeNav === 'Others' ? 'active' : ''} cursor-pointer`}>Others</li>
                </ul>
            </nav>

            <div className="MyProfile_HorizontalLine"></div>

            <div className='ChatInProfile_Two_Sections'>
                <section>

                </section>
                <section>

                </section>
            </div>
        </div >
    )
}

export default ChatInProfile