import React from 'react'
import { HorizontalLine, LowerNavigationBar, UpperNavigationBar } from '../components'
import './FindFriends.css'
const FindFriends = () => {
  return (
    <div id='FindFriendsPage' className='w-screen h-screen'>
      <header>
        <UpperNavigationBar />
        <HorizontalLine />
        <LowerNavigationBar />
        <HorizontalLine />
      </header>
      <h3 className='text-center'>Search </h3>
      <main className='FindFriendsPage_Main'>
        <section>
          <p>Suggestions</p>
          <div>
            <div className='FindFriendsPage_ListFriends'>
              <div><img src="https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg" alt="" /></div>
              <p>Name</p>
            </div>
          </div>
        </section>
        <section></section>
      </main>
    </div>
  )
}

export default FindFriends