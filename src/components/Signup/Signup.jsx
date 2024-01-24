import React, { useCallback, useEffect, useState } from "react";
import "./Signup.css";
import { Link, useNavigate } from "react-router-dom";
import { Logo, Input, Button } from "../";
import { useForm } from "react-hook-form";
import authService from "../../appwrite/auth";
import { useDispatch } from "react-redux";
import { login } from "../../store/authSlice";
import { useSelector } from "react-redux";
import profile from "../../appwrite/profile";

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
    console.log(data);
    setError(null);
    if (!gender) return;
    try {
      const userData = await authService.createAccount({ ...data, gender });
      console.log(userData);
      if (typeof userData === "string" && userData === authRateLimit) {
        setError("You Have reached Maximum signup limit. Try later sometime");
        return;
      }
      if (typeof userData === "string" && userData === sameId) {
        setError("A user with the same name, email, or phone already exists");
        return;
      }
      if (userData) {
        const userData = await authService.getCurrentUser();
        if (userData) dispatch(login(userData));
        navigate("/");
        setGender(null);
      } else {
        setError("Please check the credentials");
      }

      if (userData) {
        try {
          let userProfile = await profile.createProfile({
            gender,
            name: data.name,
            userIdAuth: userData.userId,
          });
          console.log(userProfile);
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      setError(error.message);
    }
  };

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
    <div className="flex items-center justify-center w-70">
      <div
        id="Signup"
        className={`flex items-center justify-center flex-col mx-auto w-full max-w-lg rounded-lg p-8 border border-black/10`}
      >
        <div className="flex justify-center items-center">
          <Logo />
        </div>
        <div className="flex flex-col w-full">
          <h1 className="font-bold text-3xl mt-3 text-center text-black">
            SignIn
          </h1>
          <div className="mx-auto mt-2">
            <p>
              Already have an Account ?&nbsp;
              <Link
                className="font-medium text-primary transition-all duration-200 hover:underline"
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
            <div className="w-full flex flex-col justify-center items-center">
              <Input
                placeholder="Name"
                className="w-80 rounded px-2 my-3 p-1 text-lg bg-gray-300 border-none"
                {...register("name", {
                  required: true,
                })}
              />
              <Input
                placeholder="ID"
                className="w-80 rounded px-2 my-3 p-1 text-lg bg-gray-300 border-none"
                {...register("ID", {
                  required: true,
                })}
                onInput={(e) => {
                  let x = getValues("name");
                  setValue("ID", createID(e.currentTarget.value), {
                    required: true,
                  });
                }}
              />

              <Input
                placeholder="Email"
                className="w-80 rounded px-2 my-3 p-1 text-lg bg-gray-300 border-none"
                {...register("email", {
                  required: true,
                })}
              />
              <Input
                className=" border-none px-2 rounded p-1 my-3 bg-gray-300 text-lg w-80"
                placeholder="Password"
                {...register("password", {
                  required: true,
                })}
              />

              <div className="flex justify-between items-center w-60 gap-5 mt-3 mb-3">
                <Button
                  className="rounded-sm w-40 py-1 px-2 flex justify-evenly items-center bg-gray-200 hover:bg-gray-300"
                  onClick={() => setGender("male")}
                >
                  <i className="bx bx-male-sign text-xl font-bold text-blue-900"></i>
                  <span className="font-bold text-blue-900">Male</span>
                </Button>
                <Button
                  className="rounded-sm w-40 py-1 px-2 flex justify-evenly items-center bg-gray-200 hover:bg-gray-300"
                  onClick={() => setGender("female")}
                >
                  <i className="bx bx-female-sign text-xl font-bold text-pink-600"></i>
                  <span className="font-bold text-pink-600">Female</span>
                </Button>
              </div>
            </div>
            <div>
              <p>
                <Link className="hover:underline text-sm">
                  Forget Your Password ?
                </Link>
              </p>
            </div>
            <div>
              <Button type="submit" className="mt-3">
                SignIn
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
