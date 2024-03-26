import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input, Button, Logo, UpperNavigationBar } from "../";
import { useForm } from "react-hook-form";
import authService from "../../appwrite/auth";
import { useDispatch } from "react-redux";
import { login as authLogin } from "../../store/authSlice";
import QueryFlow from '../../assets/QueryFlow.png'
import './Login.css'
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const { register, handleSubmit } = useForm();

  const login = async (data) => {
    setError(null);
    try {
      const session = await authService.login(data);
      console.log(session);
      if (session) {
        const userData = await authService.getCurrentUser();
        if (userData) dispatch(authLogin({ userData }));
        navigate("/");
      } else {
        setError("Invalid Credential");
      }
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <>
      {/* <UpperNavigationBar /> */}
      <div id="Login_Container" className="flex items-center justify-center w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div
          className={`flex items-center justify-center flex-col mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-8 border border-black/10`}
        >
          <div className="flex justify-center items-center">
            <img className="Login_signup_Logo" src={QueryFlow} alt="" />
          </div>
          <div className="flex flex-col w-full">
            <h1 className="font-bold text-3xl mt-3 text-center text-black">
              Login
            </h1>
            <div className="mx-auto mt-2">
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

            {error && <p className="text-red-600 mt-2 text-center">{error}</p>}

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
                <Button type="submit" className="mt-3">
                  Login
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
