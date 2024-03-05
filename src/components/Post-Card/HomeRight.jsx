import React from 'react'
import './HomeRight.css'
import { categoriesArr } from '../AskQue/Category'
const HomeRight = () => {

    return (
        <>
            <div className='HomeRight_Category mb-4'>
                <p>Search What Suits You</p>
                <div className='flex flex-wrap gap-y-2 gap-x-3'>
                    {categoriesArr?.map((category, index) => (
                        <span className='cursor-pointer' key={category.category}>{category.category}</span>
                    ))}
                </div>
            </div>
            <hr />
            <div className='flex flex-wrap gap-x-3 gap-y-2 HomeRight_Privacy'>
                <span>Feedback</span>
                <span>About Creater</span>
                <span>Trusted Responders</span>
            </div>
        </>
    )
}

export default HomeRight