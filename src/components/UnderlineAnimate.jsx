import React from 'react'
import './UnderlineAnimate.css'

export default function UnderlineAnimate({ children, className = "" }) {
    return (
        <div id="UnderlineAnimate-Container" className='relative w-full'>
            {children}
            <div className={`rounded-2xl h-[2px] mx-auto absolute bottom-[-2px] left-0 right-0 w-0 transition-[width] duration-150 ease-in ${className}`}></div>
        </div>
    )
}
