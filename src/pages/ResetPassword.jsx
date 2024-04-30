import React from "react";
import './ResetPassword.css'
import { useForm } from "react-hook-form";
import QueryFlow from '../assets/QueryFlow.png'
import { Button } from "../components";
import authService from "../appwrite/auth";
import { useNavigate } from 'react-router-dom'
import { useAskContext } from "../context/AskContext";

const ResetPassword = () => {

    const navigate = useNavigate();
    const urlParams = new URLSearchParams(window.location.search);
    const secret = urlParams.get('secret');
    const userId = urlParams.get('userId');

    const {
        isDarkModeOn,
        setnotificationPopMsg,
        setNotificationPopMsgNature,
    } = useAskContext()

    const { register, handleSubmit } = useForm();
    const submit = async (data) => {
        try {
            const reset = await authService.resetPassword(userId, secret, data.Password, data.Repeat_Password);
            console.log(reset);
            setNotificationPopMsgNature((prev) => true);
            setnotificationPopMsg((prev) => "Password Updated");
            navigate('/login');
           

        } catch (error) {
            setNotificationPopMsgNature((prev) => false);
            setnotificationPopMsg((prev) => "Password not Updated. Try again Later");
        }

    }

    return (
        <div
            id="reset_Password"
            className="flex items-center justify-center w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
            <div
                className={`flex items-center justify-center flex-col mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-8 border border-black/10`}
            >
                <div className="flex justify-center items-center">
                    <img className="Login_signup_Logo" src={QueryFlow} alt="" />
                </div>
                <div className="ResetPassword_ResetPassword flex flex-col w-full">
                    <h2 className={`font-bold text-2xl mt-3 mb-1 text-center ${isDarkModeOn ? 'text-white' : 'text-black'}`}>
                        Reset Your Password
                    </h2>

                    <form
                        className="max-w-full flex flex-col justify-center items-center"
                        onSubmit={handleSubmit(submit)}
                    >
                        <div
                            id="Login"
                            className="w-full flex flex-col justify-center items-center mb-3 gap-8"
                        >
                            <div className="relative flex flex-col">
                                <input
                                    required
                                    type="text"
                                    placeholder=""
                                    className="w-80 rounded px-2 p-1 text-lg bg-gray-300 border-none"
                                    {...register("Password", {
                                        required: true,
                                    })}
                                />
                                <span>New Password</span>
                                <i className="w-full"></i>
                            </div>
                            <div className="relative flex flex-col">
                                <input
                                    required
                                    type="text"
                                    placeholder=""
                                    className="w-80 rounded px-2 p-1 text-lg bg-gray-300 border-none"
                                    {...register("Repeat_Password", {
                                        required: true,
                                    })}
                                />
                                <span>Repeat Password</span>
                                <i className="w-full"></i>
                            </div>
                        </div>

                        <div>
                            <Button
                                type="submit"
                                className="mt-3 rounded-sm block px-2 py-1 login_signIn_Btn"
                            >
                                Change Password
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
