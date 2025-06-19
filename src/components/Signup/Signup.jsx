import "./Signup.css";
import React from "react";
import { GoBackHome } from "..";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import authService from "../../appwrite/auth";
import { login } from "../../store/authSlice";
import { checkAppWriteError } from "@/messages";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { useNotificationContext } from "@/context/NotificationContext";

const Signup = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { setNotification } = useNotificationContext()

  const { register, handleSubmit } = useForm();

  const { mutate, isPending } = useMutation(
    {
      mutationFn: async (data) => {
        await authService.createAccount({ ...data })
      },
      onSuccess: async (data, variables, context) => {
        try {
          const userData = await authService.getCurrentUser();
          console.log(userData)
          if (userData) {
            // const avatar_url = avatarService.createAvatar({ name: userData?.name })
            // console.log(avatar_url)
            // const profile = await profile.createProfile({
            //   name: userData?.name,
            //   userIdAuth: userData?.$id,
            //   profileImgID: null,
            //   profileImgURL: avatar_url?.href || avatar_url,
            // });
            // console.log(profile)
            dispatch(login({ userData }));
            // dispatch(userProfile({ profile }))
            navigate("/");
          }
          if (!userData) {
            setNotification({ message: "User not found", type: "error" })
          }
        } catch (error) {
          console.log(error)
        }
      },
      onError: (error, variables, context) => {
        setNotification({ message: checkAppWriteError(error?.message), type: 'error' })
      },
    }
  )

  const create = async (data) => {
    // // Checking if username already exists
    // const isProfileAlreadyExist = await profile.listProfile({ name: data?.name })

    // if (isProfileAlreadyExist?.total > 0) {
    //   setNotification({ message: "Username already exists", type: "error" })
    //   return
    // }
    mutate({ ...data })
  }


  return (

    <div id="Signup_container">
      <GoBackHome />
      <div
        id="Signup"
        className="flex items-center justify-center flex-col mx-auto rounded-lg h-[90%] gap-2"
      >
        
        <img className="Login_signup_Logo flex justify-center items-center" src="Thoughtify.webp" alt="Logo" />

        <h2 className="font-bold text-2xl mt-2 text-center">
          Sign-In
        </h2>

        <p className="text-center">
          Already have an Account ?&nbsp;
          <Link
            className="text-primary hover:underline font-bold"
            to={"/login"}
          >
            Login
          </Link>
        </p>

        <form
          className="max-w-full flex flex-col justify-center items-center mb-2"
          onSubmit={handleSubmit(create)}
        >
          <div className="signup_insideForm_div w-full flex flex-col justify-center items-center mt-5 gap-8">
            <div className='relative inputTransition flex flex-col'>
              <Input
                required
                type="text"
                placeholder=""
                className="w-80 border-none"
                {...register("name", {
                  required: true,
                })}
              />
              <span>Name</span>
              <i className="w-full"></i>
            </div>
            <div className='relative inputTransition flex flex-col'>
              <Input
                required
                type="email"
                placeholder=''
                className="Input w-80 border-none"
                {...register("email", {
                  required: true,
                })}
              />
              <span>Email</span>
              <i className="w-full"></i>
            </div>
            <div className='relative inputTransition flex flex-col'>
              <Input
                minLength={8}
                type="password"
                required
                placeholder=''
                className="w-80 bg-transparent border-none"
                {...register("password", {
                  required: true,
                })}
              />
              <span>Password</span>
              <i className="w-full"></i>
            </div>
          </div>

          <Button type="submit" className="rounded-sm w-20 block px-4 mt-3 py-1 login_signIn_Btn">
            {`${isPending ? 'wait...' : 'SignIn'}`}
          </Button>
        </form>

        <Button
          variant="destructive"
          onClick={() => authService.googleAuth()}
          type="button" className="mx-auto" >
          Sign in with Google
        </Button>
      </div>
    </div>

  );
};

export default Signup;
