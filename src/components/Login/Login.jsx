import './Login.css'
import { Button } from "../ui/button";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import authService from "../../appwrite/auth";
import { checkAppWriteError } from '@/messages';
import { Link, useNavigate } from "react-router-dom";
import { useAskContext } from "../../context/AskContext";
import { login as authLogin } from "../../store/authSlice";
import { useNotificationContext } from "@/context/NotificationContext";
import { siteName } from '@/constant';

const Login = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isWaiting, setIsWaiting] = useState(false);

  const { register, handleSubmit } = useForm();

  const { isDarkModeOn } = useAskContext()
  const { setNotification } = useNotificationContext()


  const login = async (data) => {
    try {
      setIsWaiting(true)
      const session = await authService.login({ ...data });
      if (session?.success) {
        const userData = await authService.getCurrentUser();
        if (userData) dispatch(authLogin({ userData }));
        navigate("/");
        setNotification({ message: 'You are Logged In', type: 'success' })
      } else {
        setNotification({ message: checkAppWriteError(session?.error), type: 'error' })
      }
      setIsWaiting(false)
    } catch (error) {
      setNotification({ message: error.message, type: 'error' })
      setIsWaiting(false)
    }
  };

  return (
    <div id="Login_Container" className="flex items-center justify-center w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <section onClick={() => navigate("/")} className="GoToHomePageDiv">
        <div><img src="goBack.png" alt="Go Back" /></div>
        <span>Home</span>
      </section>
      <div
        className="flex items-center justify-center flex-col mx-auto w-full max-w-lg"
      >
        <div className="flex justify-center items-center">
          <img className="Login_signup_Logo" src="Thoughtify.webp" alt={siteName} />
        </div>
        <div className="flex flex-col w-full">
          <h1 className={`Login_Login font-bold text-3xl mt-3 text-center text-black ${isDarkModeOn ? 'text-white' : 'text-black'}`}>
            Login
          </h1>
          <div className="Login_dont_have_acc mx-auto my-2">
            <p>
              Don't have an Account ?&nbsp;
              <Link
                className="font-medium text-primary transition-all duration-200 hover:underline"
                to={"/signup"}
              >
                Signup
              </Link>
            </p>
          </div>

          <form
            className="max-w-full flex flex-col justify-center items-center"
            onSubmit={handleSubmit(login)}
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
                <span>Email</span>
                <i className="w-full"></i>
              </div>
              <div className="relative flex flex-col">
                <input
                  required
                  minLength={8}
                  type="password"
                  placeholder=""
                  className="border-none rounded px-2 p-1 bg-gray-300 text-lg w-80"
                  {...register("password", {
                    required: true,
                  })}
                />
                <span>Password</span>
                <i className="w-full"></i>
              </div>
            </div>
            <div>
              <p>
                <Link to={`/forgotPassword`} className="hover:underline text-sm">
                  Forget Your Password ?
                </Link>
              </p>
            </div>
            <div>
              <Button type="submit" className="mt-3 rounded-sm w-20 block px-2 py-1 login_signIn_Btn">
                {`${isWaiting ? 'wait...' : 'Login'}`}
              </Button>
            </div>
          </form>
          <div className="text-center">Or</div>
          <div className="Login_Google_Div flex justify-center">
            <button
              onClick={() => authService.googleAuth()}
              type="button" className="login-with-google-btn" >
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
