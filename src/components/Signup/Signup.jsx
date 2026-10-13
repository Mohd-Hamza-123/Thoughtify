import React from "react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { FcGoogle } from "react-icons/fc";

import { GoBackHome } from "..";
import { ThoughtifyLogo } from "../Logo";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

import useProfile from "@/hooks/useProfile";
import authService from "@/appwrite/auth";
import { login } from "@/store/authSlice";
import { homePageLoading } from "@/store/loadingSlice";
import { checkAppWriteError } from "@/messages";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { createProfile } = useProfile();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => authService.createAccount(data),

    onSuccess: async () => {
      const userData = await authService.getCurrentUser();

      await createProfile({
        userId: userData?.$id,
        name: userData?.name,
      });

      dispatch(login({ userData }));
      dispatch(homePageLoading({ homePageLoading: false }));

      navigate("/");
    },

    onError: (error) => {
      toast.error(checkAppWriteError(error?.message));
    },
  });

  const create = (data) => mutate(data);

  return (
    <main className="relative h-screen overflow-hidden bg-background">
      <div className="absolute left-4 top-4">
        <GoBackHome />
      </div>

      <section className="flex h-full items-center justify-center px-4">
        <div className="flex w-full max-w-sm flex-col items-center">
          <ThoughtifyLogo />

          <h1 className="mt-3 text-center text-3xl font-bold">
            Create Your Account
          </h1>

          <p className="mt-2 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-primary hover:underline"
            >
              Log in
            </Link>
          </p>

          <form
            onSubmit={handleSubmit(create)}
            className="mt-6 flex w-full flex-col gap-4"
          >
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>

              <Input
                id="name"
                placeholder="Enter your name"
                className="h-10"
                {...register("name", {
                  required: "Name is required",
                })}
              />

              {errors.name && (
                <p className="text-xs text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

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
                placeholder="Create a password"
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

            <Button
              type="submit"
              disabled={isPending}
              className="mt-2 h-10 w-full"
            >
              {isPending ? <Spinner /> : "Create Account"}
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

export default Signup;