import "./Signup.css";
import React from "react";
import { GoBackHome } from "..";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ThoughtifyLogo } from "../Logo";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import useProfile from "@/hooks/useProfile";
import authService from "../../appwrite/auth";
import { checkAppWriteError } from "@/messages";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { login, logout } from "../../store/authSlice";
import { homePageLoading } from "@/store/loadingSlice";
import { useNotificationContext } from "@/context/NotificationContext";

const Signup = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { createProfile } = useProfile()
  const { register, handleSubmit } = useForm();
  const { setNotification } = useNotificationContext()

  const { mutate, isPending } = useMutation({
    mutationFn: async (data) => await authService.createAccount({ ...data }),
    onSuccess: async (data, variables, context) => {
      const userData = await authService.getCurrentUser()
      await createProfile({ userId: userData?.$id, name: userData?.name })
      dispatch(login({ userData }));
      dispatch(homePageLoading({ homePageLoading: false }))
      navigate('/')
    },
    onError: (error, variables, context) => setNotification({ message: checkAppWriteError(error?.message), type: 'error' })
  })

  const create = (data) => mutate({ ...data })

  return (

    <div id="Signup_container">
      <GoBackHome />
      <div className="flex items-center justify-center flex-col mx-auto rounded-lg h-[90%] gap-2 w-full">

        <ThoughtifyLogo className="mx-auto" />

        <h2 className="font-bold text-2xl mt-2 text-center"> Sign-In</h2>

        <p className="text-center">
          Already have an Account ?&nbsp;
          <Link
            className="text-primary hover:underline font-bold"
            to={"/login"}>
            Login
          </Link>
        </p>

        <form
          className="max-w-full flex flex-col justify-center items-center mb-2"
          onSubmit={handleSubmit(create)}>

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
          type="button" className="lg:w-1/5 mx-auto" >
          Sign in with Google
        </Button>
      </div>
    </div>

  );
};

export default Signup;
