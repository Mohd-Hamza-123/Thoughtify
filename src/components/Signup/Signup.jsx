import React, { useCallback, useContext, useEffect, useState } from "react";
import "./Signup.css";
import { Link, useNavigate } from "react-router-dom";
import { Logo, Input, Button, UpperNavigationBar } from "../";
import { getUserProfile } from "../../store/profileSlice";
import { useForm } from "react-hook-form";
import authService from "../../appwrite/auth";
import { useDispatch } from "react-redux";
import { login } from "../../store/authSlice";
import QueryFlow from '../../assets/QueryFlow.png'
import profile from "../../appwrite/profile";
import avatar from "../../appwrite/avatars";
import { useAskContext } from "../../context/AskContext";
import googlelogin from '../../assets/googlelogin.jpg'
const Signup = () => {
  const { myUserProfile, setMyUserProfile } = useAskContext()
  const authRateLimit =
    "AppwriteException: Rate limit for the current endpoint has been exceeded. Please try again after some time.";
  const sameId =
    "AppwriteException: A user with the same id, email, or phone already exists in this project.";

  const [error, setError] = useState(null);
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const create = async (data) => {
    setError(null);

    const userDataCreated = await authService.createAccount({ ...data });
    if (typeof userDataCreated === "string" && userDataCreated === authRateLimit) {
      setError("You Have reached Maximum signup limit. Try later sometime");
      return;
    }
    if (typeof userDataCreated === "string" && userDataCreated === sameId) {
      setError("A user with the same name, email, or phone already exists");
      return;
    }

    if (userDataCreated) {
      const userData = await authService.getCurrentUser();
      dispatch(login({ userData }))
      let profileAvatar = await avatar.profileAvatar(data.name);
      let response = await fetch(profileAvatar.href)
      let blob = await response.blob();
      const file = new File([blob], data.name || 'downloaded_image', { type: 'image/*' })
      const createProfileBucket = await profile.createBucket({ file })
      const getProfileURL = await profile.getStoragePreview(createProfileBucket.$id)
      const profileImgURL = getProfileURL.href
      const userProfile = await profile.createProfile({
        name: data.name,
        userIdAuth: userData?.$id,
        profileImgID: createProfileBucket.$id,
        profileImgURL,
      })
      console.log(userProfile)
      setMyUserProfile((prev) => userProfile)
      dispatch(getUserProfile({ userProfile }))
      if (userProfile) {
        navigate("/");
      }
    } else {
      setError("Please check the credentials");
    }
  }


  return (

    <div id="Signup_container" className="flex items-center justify-center w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">

      <div
        id="Signup"
        className={`flex items-center justify-center flex-col mx-auto rounded-lg`}
      >
        <div>
          <div className="flex justify-center items-center">
            {/* <Logo /> */}
            <img className="Login_signup_Logo" src={QueryFlow} alt="" />
          </div>
          <div className="flex flex-col w-full">
            <h1 className="font-bold text-2xl mt-2 text-center">
              Sign-In
            </h1>

            <div className="mx-auto mt-2">
              <p>
                Already have an Account ?&nbsp;
                <Link
                  className="text-primary transition-all duration-200 hover:underline font-bold"
                  to={"/login"}
                >
                  Login
                </Link>
              </p>
            </div>
            {error && <p className="text-red-600 mt-2 text-center">{error}</p>}

            <form
              className="max-w-full flex flex-col justify-center items-center"
              onSubmit={handleSubmit(create)}
            >
              <div className="signup_insideForm_div w-full flex flex-col justify-center items-center mt-5">

                <div className="flex flex-col gap-8">
                  <div className='relative inputTransition flex flex-col'>
                    <input
                      required
                      type="text"
                      placeholder=""
                      className="w-80"
                      {...register("name", {
                        required: true,
                      })}
                    />
                    <span>Name</span>
                    <i className="w-full"></i>
                  </div>


                  <div className='relative inputTransition flex flex-col'>
                    <input
                      required
                      type="email"
                      placeholder=''
                      className="Input w-80"
                      {...register("email", {
                        required: true,
                      })}
                    />
                    <span>Email</span>
                    <i className="w-full"></i>
                  </div>
                  <div className='relative inputTransition flex flex-col'>
                    <input
                      minLength={8}
                      type="password"
                      required
                      placeholder=''
                      className="w-80 bg-transparent"
                      {...register("password", {
                        required: true,
                      })}
                    />
                    <span>Password</span>
                    <i className="w-full"></i>
                  </div>

                </div>
              </div>
              <div className="mt-4">
                <Button type="submit" className="rounded-sm w-20 block px-2 py-1 bg-slate-800 text-white">
                  SignIn
                </Button>
              </div>
            </form>
            <p className="text-center mt-2">Or</p>

            <div className="flex justify-center">
              <button onClick={() => {
                const googleAuthentcation = authService.googleAuth()
                // console.log(googleAuthentcation)
              }} type="button" className="login-with-google-btn" >
                Sign in with Google
              </button>
            </div>

          
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
