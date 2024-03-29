import React, { useState } from 'react'
import './ForgetPassword.css'
import QueryFlow from '../assets/QueryFlow.png'
import { Button } from '../components'
const ForgetPassword = () => {
  const [isConfirmationCode, setisConfirmationCode] = useState(true)
  return (
    <div id='ForgetPassword'>
      <section>
        {isConfirmationCode ? <form id='ForgetPassword_ResetPassword'>
          <div className="flex justify-center items-center">
            <img className="ForgetPassword_Logo" src={QueryFlow} alt="QueryFlow" />
          </div>
          <div className=''>
            <label htmlFor="">Enter Confirmation Code</label>
            <input type="number" name="" id="" placeholder='Confirmation Code' />
          </div>
          <div className=''>
            <label htmlFor="">Enter New Password</label>
            <input type="password" placeholder='New Password' name="" id="" />
          </div>
          <div className='flex justify-center'>
            <Button type='submit'>Change Password</Button>
          </div>
        </form> : <form id='ForgetPassword_ConfirmationCode'>
          <div className="flex justify-center items-center">
            <img className="ForgetPassword_Logo" src={QueryFlow} alt="" />
          </div>
          <div className=''>
            <label htmlFor="">Enter Your Email </label>
            <input type="email" name="" id="" />
          </div>
          <div className='flex justify-center'>
            <Button type='submit'>Get Confirmation Code</Button>
          </div>
        </form>}
      </section>
    </div>
  )
}

export default ForgetPassword