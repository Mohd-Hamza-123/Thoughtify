import { toast } from "sonner";
import React from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";

import { GoBackHome } from "..";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { ThoughtifyLogo } from "../Logo";

import profile from "@/appwrite/profile";
import authService from "@/appwrite/auth";
import { checkAppWriteError } from "@/messages";
import { userProfile } from "@/store/profileSlice";
import { homePageLoading } from "@/store/loadingSlice";
import { login as authLogin } from "@/store/authSlice";

const Login = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    
    register,
    handleSubmit,
    formState: { errors , isSubmitting },
  } = useForm();

  const login = async (data) => {

    try {

      const session = await authService.login(data);

      if (session?.success) {

        const userData = await authService.getCurrentUser();
        const profileData = await profile.listSingleProfile(userData.$id);
        dispatch(authLogin({ userData }));
        dispatch(userProfile({ userProfile: profileData }));
        dispatch(homePageLoading({ homePageLoading: false }));
        toast.success(`Welcome back, ${userData.name}!`);
        navigate("/");

      } else {
        await authService.logout();
        toast.error(checkAppWriteError(session?.error));
      }
      
    } catch (error) {
      if (import.meta.env.DEV) {
        console.log(error instanceof Error ? error.message : error);
      }

      toast.error("Oops! something went wrong.");
    } 
  };

  return (
    <main className="relative h-screen overflow-hidden bg-background text-foreground">
      <div className="absolute left-4 top-4">
        <GoBackHome />
      </div>

      <section className="flex h-full items-center justify-center px-4">
        <div className="flex w-full max-w-sm flex-col items-center">
          <ThoughtifyLogo />

          <h1 className="mt-3 text-center text-3xl font-bold">
            Welcome Back
          </h1>

          <p className="mt-2 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-primary hover:underline"
            >
              Sign up
            </Link>
          </p>

          <form onSubmit={handleSubmit(login)} className="mt-6 flex w-full flex-col gap-4">

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>

              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="h-10"
                {...register("email", {
                  required: "Email is required",
                })}
              />

              {errors.email && (
                <p className="text-xs text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">

              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>

              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="h-10"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
              />

              {errors.password && (
                <p className="text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <Link
                to="/forgotPassword"
                className="text-sm font-medium text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-1 h-10 w-full">
              {isSubmitting ? <Spinner /> : "Log in"}
            </Button>
            
          </form>

          <div className="my-4 flex w-full items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-medium text-muted-foreground">
              OR
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <Button
            variant="outline"
            type="button"
            onClick={() => authService.googleAuth()}
            className="h-10 w-full gap-2"
          >
            <FcGoogle size={20} />
            Continue with Google
          </Button>
        </div>
      </section>
    </main>
  );
};

export default Login;