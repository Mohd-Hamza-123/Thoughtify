import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Link, useNavigate } from 'react-router-dom'
import authService from '../appwrite/auth'
import { Input } from '@/components/ui/input'
const ForgetPassword = () => {

  const [email, setEmail] = useState('')
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    try {
      await authService.forgetPassword(email)
      // toast success if you have one
    } catch (err) {
      // toast error if needed
    }
  }

  return (
    <div
      id='Login_Container'
      className="relative min-h-screen w-full
        grid place-items-center
        overflow-hidden
        bg-gradient-to-b from-gray-50 via-gray-50 to-gray-100
        dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-900">

      <Button
        onClick={() => navigate('/')}
        className="absolute left-6 top-6
          rounded-full px-4 py-2 text-sm
          bg-white dark:bg-neutral-900
          border border-gray-200 dark:border-neutral-800
          shadow hover:bg-gray-50 dark:hover:bg-neutral-800
          text-gray-700 dark:text-gray-200"
        variant="ghost"
      >
        ← Back to Home
      </Button>

  
      <div
        className="w-[92%] max-w-xl
          rounded-2xl
          bg-white dark:bg-neutral-900
          border border-gray-200 dark:border-neutral-800
          shadow-xl shadow-gray-200/50 dark:shadow-black/20"
      >
        <div className="p-6 sm:p-10">
     
          <div className="flex justify-center">
            <img
              src="Thoughtify.webp"
              alt="Logo"
              className="h-14 rounded-full"
            />
          </div>

          
          <div className="mt-5 mb-5 text-center">
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
              Password Recovery
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Enter your email to reset your password
            </p>
          </div>

          {/* Form */}
          <form
            className="max-w-full flex flex-col justify-center items-center gap-6"
            onSubmit={submit}>

            <div className="relative flex flex-col">
              <Input
                required
                type="email"
                placeholder=""
                className="w-80 rounded px-2 p-1 text-lg bg-gray-300 border-none"
              />
              <span>Email</span>
              <i className="w-full"></i>
            </div>

            <Button type="submit" className="mt-3 rounded-sm w-20 block px-2 py-1 login_signIn_Btn">
              {`${true ? 'wait...' : 'Login'}`}
            </Button>

          </form>

          {/* Helper + bottom link */}
          <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
            We’ll send you a reset link if your email exists in our system.
          </p>

          <div className="mt-3 text-center">
            <Link
              to="/login"
              className="text-sm font-medium text-blue-600 hover:text-blue-700">
              Return to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgetPassword
