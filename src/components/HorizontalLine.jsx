import React from 'react'
import { useAskContext } from '../context/AskContext'

const HorizontalLine = () => {
    const { isDarkModeOn } = useAskContext()
    return (
        <div className={`MyProfile_HorizontalLine ${isDarkModeOn ? 'darkMode' : ''}`}></div>
    )
}

export default HorizontalLine