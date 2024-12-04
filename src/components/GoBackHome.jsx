import React from 'react'
import { useAskContext } from '@/context/AskContext';
import { Link } from 'react-router-dom';
const GoBackHome = () => {
    const { isDarkModeOn } = useAskContext();
    return (
        <Link to={"/"} className="GoToHomePageDiv">
            <img src="goBack.png" alt="Image" className="h-4 w-4" />
            <span className={`${isDarkModeOn ? 'text-white' : 'text-black'}`}>Home</span>
        </Link>
    )
}

export default GoBackHome