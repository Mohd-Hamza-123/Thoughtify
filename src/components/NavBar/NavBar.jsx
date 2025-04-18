import React from 'react'
import { UpperNavigationBar, LowerNavigationBar } from '../'

const NavBar = () => {
    return (
        <div className='z-30 relative'>
            <UpperNavigationBar />
            <LowerNavigationBar />
        </div>
    )
}

export default NavBar