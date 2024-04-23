import React from 'react'
import './Loader.css'
import QueryFlow from '../../assets/QueryFlow.png'
const Loader = () => {
    return (
        <div className='LoaderPage'>
            <div>
                <img src={QueryFlow} alt="" />
                <h1>Thoughtify</h1>
            </div>

            <div className="LoaderPage_loader"></div>
        </div>
    )
}

export default Loader