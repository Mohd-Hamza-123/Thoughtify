import React, { useState } from "react";
import "./Signup.css";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { userProfile } from "../../store/profileSlice";
import { useForm } from "react-hook-form";
import authService from "../../appwrite/auth";
import { useDispatch } from "react-redux";
import { login } from "../../store/authSlice";
import profile from "../../appwrite/profile";
import { useAskContext } from "../../context/AskContext";
import goBack from '../../assets/goBack.png'
import { useNotificationContext } from "@/context/NotificationContext";


const Signup = () => {
  const {
    setMyUserProfile,
    isDarkModeOn,
  } = useAskContext();

  const {setNotification} = useNotificationContext()

  const [isWaiting, setIsWaiting] = useState(false);

  const authRateLimit =
    "AppwriteException: Rate limit for the current endpoint has been exceeded. Please try again after some time.";

  const sameId =
    "AppwriteException: A user with the same id, email, or phone already exists in this project.";

  const { register, handleSubmit } = useForm();
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const create = async (data) => {

    try {
      setError(null);
      setIsWaiting(true);
      // Checking if username already exists 
      const isProfileNameAlreadyExist = await profile.listProfile({ name: data?.name })

      if (isProfileNameAlreadyExist?.total > 0) {
        setIsWaiting((prev) => false);
        return setError("Username already exists")
      }

      const userDataCreated = await authService.createAccount({ ...data });
  
      if (typeof userDataCreated === "string" && userDataCreated === authRateLimit) {
        setError("You Have reached Maximum signup limit. Try later sometime");
        return null
      }
      if (typeof userDataCreated === "string" && userDataCreated === sameId) {
        setError("A user with the same name, email, or phone already exists");
        return null
      }

      if (userDataCreated) {
        const userData = await authService.getCurrentUser();

        if (!userData) {
          setIsWaiting((prev) => false);
          setNotification({ message: "User not found", type: "error" })
          return undefined
        }
        
        dispatch(login({ userData }));

        const response = await profile.createProfile({
          name: userData?.name,
          userIdAuth: userData?.$id,
          profileImgID: null,
          profileImgURL: "https://i.pinimg.com/736x/d2/98/4e/d2984ec4b65a8568eab3dc2b640fc58e.jpg",
        });

       
        setMyUserProfile((prev) => response)
        dispatch(userProfile({ response }))
        if (response) navigate("/");

      } else {
        setError("Please check the credentials");
      }
      setIsWaiting(false)
    } catch (error) {
      setIsWaiting(false)
    }

  }


  return (

    <div id="Signup_container" className="flex items-center justify-center w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div onClick={() => navigate("/")} className="GoToHomePageDiv">
        <div><img src={goBack} alt="" /></div>
        <span className={`${isDarkModeOn ? 'text-white' : 'text-black'}`}>Home</span>
      </div>
      <div
        id="Signup"
        className={`flex items-center justify-center flex-col mx-auto rounded-lg`}
      >
        <div>
          <div className="flex justify-center items-center">
            {/* <Logo /> */}
            <img className="Login_signup_Logo" src="Thoughtify.webp" alt="Logo" />
          </div>
          <div className="Signup_Signup_div flex flex-col w-full">
            <h1 className="font-bold text-2xl mt-2 text-center">
              Sign-In
            </h1>

            <div className="Signup_have_an_Acc mx-auto mt-2">
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
            {error && <p className="text-red-600 my-2 text-center text-sm">{error}</p>}

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
                <Button type="submit" className="rounded-sm w-20 block px-2 py-1 login_signIn_Btn">
                  {`${isWaiting ? 'wait...' : 'SignIn'}`}
                </Button>
              </div>
            </form>
            <p className="text-center mt-1">Or</p>

            <div className="Signup_SignIn_Google_div flex justify-center">
              <button onClick={() => {
                const googleAuthentcation = authService.googleAuth()
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
