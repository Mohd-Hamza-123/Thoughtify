import React, { useCallback, useEffect, useState } from "react";
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

const Signup = () => {
  const authRateLimit =
    "AppwriteException: Rate limit for the current endpoint has been exceeded. Please try again after some time.";
  const sameId =
    "AppwriteException: A user with the same id, email, or phone already exists in this project.";

  const [error, setError] = useState(null);
  const [gender, setGender] = useState(null);
  const { register, handleSubmit, watch, setValue, getValues } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const create = async (data) => {
    setError(null);
    if (!gender) return;
    const userDataCreated = await authService.createAccount({ ...data, gender });
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
      console.log(createProfileBucket)
      const userProfile = await profile.createProfile({
        gender,
        name: data.name,
        userIdAuth: userData?.$id,
        profileImgID: createProfileBucket.$id
      })
      console.log(userProfile)
      dispatch(getUserProfile({ userProfile }))
      if (userProfile) {
        navigate("/");
        setGender(null)
      }
    } else {
      setError("Please check the credentials");
    }

  }



  const createID = useCallback((value) => {
    if (value && typeof value === "string") {
      return value
        .trim()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s/g, "-");
    }
    return "";
  }, []);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "name") {
        setValue("ID", createID(value.name), {
          shouldValidate: true,
        });
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [watch, setValue, createID]);
  return (
  
      <div id="Signup_container" className="flex items-center justify-center w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">

        <div
          id="Signup"
          className={`flex items-center justify-center flex-col mx-auto w-full max-w-lg rounded-lg`}
        >
          <div>
            <div className="flex justify-center items-center">
              {/* <Logo /> */}
              <img className="Login_signup_Logo" src={QueryFlow} alt="" />
            </div>
            <div className="flex flex-col w-full">
              <h1 className="font-bold text-3xl mt-3 text-center text-black">
                Sign-In
              </h1>


              {error && <p className="text-red-600 mt-2 text-center">{error}</p>}

              <form
                className="max-w-full flex flex-col justify-center items-center"
                onSubmit={handleSubmit(create)}
              >
                <div className="signup_insideForm_div w-full flex flex-col justify-center items-center mt-7">

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
                  <div className="mx-auto mt-5">
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
                  <div className="flex justify-between items-center w-60 gap-5 mt-3 mb-3">
                    <Button
                      className="rounded-sm w-40 py-1 px-2 flex justify-evenly items-center bg-gray-200 hover:bg-gray-300"
                      onClick={() => setGender("male")}
                    >
                      <i className="bx bx-male-sign text-xl font-semibold text-blue-900"></i>
                      <span className="text-blue-900">Male</span>
                    </Button>
                    <Button
                      className="rounded-sm w-40 py-1 px-2 flex justify-evenly items-center bg-gray-200 hover:bg-gray-300"
                      onClick={() => setGender("female")}
                    >
                      <i className="bx bx-female-sign text-xl text-pink-600 font-semibold"></i>
                      <span className="text-pink-600">Female</span>
                    </Button>
                  </div>
                </div>
                <div className="">
                  <Button type="submit" className="rounded-sm w-20 block px-2 py-1 bg-slate-800 text-white">
                    SignIn
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Signup;
