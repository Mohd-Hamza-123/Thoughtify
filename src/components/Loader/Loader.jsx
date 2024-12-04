import React from 'react'
import './Loader.css'

const Loader = () => {
   
    return (
        <div className='LoaderPage'>
            <div>
                <img src="Thoughtify.webp" alt="Thoughtify" />
                <h1>Thoughtify</h1>
            </div>

            <div className="LoaderPage_loader"></div>
        </div>
    )
}

export default Loader