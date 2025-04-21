import React from 'react'
import './ForgetPassword.css'
import QueryFlow from '../assets/QueryFlow.png'
import { Button } from '@/components/ui/button';
import { useForm } from "react-hook-form";
import authService from '../appwrite/auth'
import { useAskContext } from '../context/AskContext'
const ForgetPassword = () => {
  const {
    isDarkModeOn,
    setnotificationPopMsg,
    setNotificationPopMsgNature,
  } = useAskContext()
  const { register, handleSubmit } = useForm();
  const submit = async (data) => {
    try {
      const recovery = await authService.forgetPassword(data.email);

      setNotificationPopMsgNature((prev) => true);
      setnotificationPopMsg((prev) => "Link is sent to your Gmail")
    } catch (error) {
      setNotificationPopMsgNature((prev) => false);
      setnotificationPopMsg((prev) => "Please Try Again Later")
    }


  }
  return (
    <div id="forget_Password" className="flex items-center justify-center w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div
        className={`flex items-center justify-center flex-col mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-8 border border-black/10`}
      >
        <div className="flex justify-center items-center">
          <img className="Login_signup_Logo" src={QueryFlow} alt="" />
        </div>
        <div className="forgetPassword_Recovery_Heading flex flex-col w-full">
          <h1 className={`font-bold text-2xl mt-3 mb-1 text-center ${isDarkModeOn ? 'text-white' : 'text-black'}`}>
            Password Recovery
          </h1>

          <form
            className="max-w-full flex flex-col justify-center items-center"
            onSubmit={handleSubmit(submit)}
          >
            <div id='Login' className="w-full flex flex-col justify-center items-center mb-3 gap-8">
              <div className="relative flex flex-col">
                <input
                  required
                  type="email"
                  placeholder=""
                  className="w-80 rounded px-2 p-1 text-lg bg-gray-300 border-none"
                  {...register("email", {
                    required: true,
                  })}
                />
                <span>Enter your Email</span>
                <i className="w-full"></i>
              </div>

            </div>

            <div>
              <Button type="submit" className="mt-3 rounded-sm block px-2 py-1 login_signIn_Btn">
                Reset Password
              </Button>
            </div>
          </form>


        </div>
      </div>
    </div>

  )
}

export default ForgetPassword