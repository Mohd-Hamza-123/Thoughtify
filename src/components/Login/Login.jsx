import './Login.css'
import { GoBackHome } from '..';
import { Input } from '../ui/input';
import { Button } from "../ui/button";
import { ThoughtifyLogo } from '../Logo';
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import authService from "../../appwrite/auth";
import { checkAppWriteError } from '@/messages';
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as authLogin } from "../../store/authSlice";
import { useNotificationContext } from "@/context/NotificationContext";
import profile from '@/appwrite/profile';
import { userProfile } from '@/store/profileSlice';
import { homePageLoading } from '@/store/loadingSlice';
import appwriteService from '@/appwrite/config';

const Login = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isWaiting, setIsWaiting] = useState(false);
  const { setNotification } = useNotificationContext()

  const login = async (data) => {
    try {
      setIsWaiting(true)
      const session = await authService.login({ ...data });
  
      if (session?.success) {
        const userData = await authService.getCurrentUser();
        if (userData) {
          dispatch(authLogin({ userData }));
          const profileData = await profile.listSingleProfile(userData?.$id)
          dispatch(userProfile({ userProfile: profileData }))
          dispatch(homePageLoading({ homePageLoading: false }))
          navigate("/");
          setNotification({
            message: 'You are Logged In',
            type: 'success'
          })
        }
      } else {
        await authService.logout()
        setNotification({
          message: checkAppWriteError(session?.error),
          type: 'error'
        })
      }
      setIsWaiting(false)
    } catch (error) {
      console.log(error)
      setNotification({
        message: error?.message || "something went wrong.",
        type: 'error'
      })
      setIsWaiting(false)
    }
  };

  useEffect(() => {
    if (errors?.password) {
      setNotification({
        message: errors.password?.message,
        type: 'error'
      })
    }
  }, [errors])

  return (
    <div id="Login_Container" className="flex items-center justify-center w-full flex-col">
      <GoBackHome />

      <div className="flex flex-col items-center justify-center w-full gap-2">
        <ThoughtifyLogo className='mx-auto' />
        <h2 className="font-bold text-2xl mt-3 text-center dark:text-white text-black">
          Login
        </h2>

        <p className='text-center'>
          Don't have an Account ?&nbsp;
          <Link
            className="font-bold text-primary  hover:underline"
            to={"/signup"}
          >
            Signup
          </Link>
        </p>

        <form
          className="max-w-full flex flex-col justify-center items-center gap-6"
          onSubmit={handleSubmit(login)}>
            
          <div className="relative flex flex-col">
            <Input
              required
              type="email"
              placeholder=""
              className="w-80 rounded px-2 p-1 text-lg bg-gray-300 border-none"
              {...register("email", {
                required: true,
              })}
            />
            <span>Email</span>
            <i className="w-full"></i>
          </div>
          <div className="relative flex flex-col">
            <Input
              required
              minLength={8}
              type="password"
              placeholder=""
              className="border-none rounded px-2 p-1 bg-gray-300 text-lg w-80"
              {...register("password", {
                required: true,
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters long"
                }
              })}
            />
            <span>Password</span>
            <i className="w-full"></i>
          </div>


          <p>
            <Link to={`/forgotPassword`} className="hover:underline text-sm">
              Forget Your Password ?
            </Link>
          </p>

          <Button type="submit" className="mt-3 rounded-sm w-20 block px-2 py-1 login_signIn_Btn">
            {`${isWaiting ? 'wait...' : 'Login'}`}
          </Button>

        </form>


        <Button
          variant="destructive"
          onClick={() => authService.googleAuth()}
          type="button"
          className="lg:w-1/5 mx-auto px-2" >
          Sign in with Google
        </Button>
      </div>
    </div>
  );
};

export default Login;
