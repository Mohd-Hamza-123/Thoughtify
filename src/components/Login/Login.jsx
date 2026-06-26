import './Login.css'
import { toast } from "sonner"
import { GoBackHome } from '..';
import { Input } from '../ui/input';
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { ThoughtifyLogo } from '../Logo';
import profile from '@/appwrite/profile';
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import authService from "../../appwrite/auth";
import { checkAppWriteError } from '@/messages';
import { userProfile } from '@/store/profileSlice';
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { homePageLoading } from '@/store/loadingSlice';
import { login as authLogin } from "../../store/authSlice";

const Login = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isWaiting, setIsWaiting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();


  const login = async (data) => {
    try {
      setIsWaiting(true)
      const session = await authService.login({ ...data });

      if (session?.success) {
        const userData = await authService.getCurrentUser();
        if (userData) {
          dispatch(authLogin({ userData }));

          const profileData = await profile.listSingleProfile(userData.$id);

          dispatch(userProfile({ userProfile: profileData }));
          dispatch(homePageLoading({ homePageLoading: false }));

          toast.success(`Welcome back, ${userData.name}!`);
          navigate("/");
        }
      } else {
        await authService.logout()
        toast.error(checkAppWriteError(session?.error))
      }
      setIsWaiting(false)
    } catch (error) {
      if(import.meta.env.DEV){
        console.log(error instanceof Error ? error.message : error)
      }
      toast.error("Oops! something went wrong.")
      setIsWaiting(false)
    }
  };

  useEffect(() => {
    if (errors?.email) {
      toast.error(errors.email?.message)
    }
  }, [errors])

  return (
    <div id="Login_Container" className="flex items-center justify-center w-full flex-col">
      
      <GoBackHome />

      <div className="flex flex-col items-center justify-center w-full gap-2">
        <ThoughtifyLogo className='mx-auto' />
        <h2 className="font-bold text-2xl mt-3 text-center text-black">
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

          <Link to={`/forgotPassword`} className="hover:underline text-sm">
            Forget Your Password ?
          </Link>


          <Button type="submit" className="mt-3 rounded-sm block px-2 py-1 login_signIn_Btn" disabled={isWaiting}>
            {isWaiting ? <Spinner /> : 'Login'}
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