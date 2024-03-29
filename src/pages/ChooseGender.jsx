import React, { useState } from 'react'
import './ChooseGender.css'
import { Button } from '../components'
const ChooseGender = () => {
    const [Gender, setGender] = useState(null)
    const googleLogin = async () => {
        if (!Gender) {
            console.log("select Gender")
            return
        }
        console.log('Hi')
    }
    return (
        <div className='ChooseGender'>
            <div className='p-6'>
                <div className="flex justify-between items-center w-60 gap-5  mb-2">
                    <Button
                        className={`${Gender === 'male' ? 'active' : ''} rounded-sm w-40 py-1 px-1 flex justify-evenly items-center bg-gray-200`}
                        onClick={() => setGender("male")}
                    >
                        <i className="bx bx-male-sign text-xl font-semibold text-blue-900"></i>
                        <span className="text-blue-900">Male</span>
                    </Button>
                    <Button
                        className={`${Gender === 'female' ? 'active' : ''} rounded-sm w-40 py-1 px-1 flex justify-evenly items-center bg-gray-200`}
                        onClick={() => setGender("female")}
                    >
                        <i className="bx bx-female-sign text-xl text-pink-600 font-semibold"></i>
                        <span className="text-pink-600">Female</span>
                    </Button>
                </div>
                <div className='flex justify-center mt-5'>
                    <Button onClick={googleLogin} className='border px-3 py-1'>Google</Button>
                </div>
            </div>
        </div>
    )
}

export default ChooseGender