import React from 'react'
import { Link } from 'react-router-dom';

const GoBackHome = () => {
    return (
        <Link to={"/"} className="GoToHomePageDiv">
            <img src="goBack.png" alt="Image" className="h-4 w-4" />
            <span>Home</span>
        </Link>
    )
}

export default GoBackHome