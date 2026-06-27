import React from 'react'
import { toast } from "sonner"
import authService from '../appwrite/auth'
import { useForm } from "react-hook-form";
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { GoBackHome } from "@/components/index"
import { Spinner } from "@/components/ui/spinner"
import { ThoughtifyLogo } from '@/components/Logo'
import { Link, useNavigate } from 'react-router-dom'

const ForgetPassword = () => {

  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const submit = async (data) => {

    try {

      const { email } = data
      const res = await authService.forgetPassword(email)
      // console.log(res)
      if (res) {
        toast('Check your email for reset link')
        navigate('/')
      } else {
        toast.error('Something went wrong')
      }
      
    } catch (err) {
      console.error(err instanceof Error ? err.message : err)
      
      toast.error("Something went wrong.")
    }
  }

  return (
    <div
      id='Login_Container'
      className="relative min-h-screen w-full
        grid place-items-center
        overflow-hidden
        bg-gradient-to-b from-gray-50 via-gray-50 to-gray-100">

      <div className="absolute left-4 top-4">
        <GoBackHome />
      </div>


      <div
        className="w-[92%] max-w-xl">
        <div className="p-6 sm:p-10">

          <div className="flex justify-center">
            <ThoughtifyLogo />
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
            onSubmit={handleSubmit(submit)}>

            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
              })}
            />

            {errors.email && (
              <p className="text-xs text-red-500">
                {errors.email.message}
              </p>
            )}

            <Button
              disabled={isSubmitting}
              type="submit"
              className="mt-2 rounded-sm w-20 block px-2 py-1 login_signIn_Btn">
              {`${waiting ? <Spinner /> : 'Reset'}`}
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
