import React from "react";
import './ResetPassword.css'
import { Button } from "@/components/ui/button";
import authService from "../appwrite/auth";
import { useNavigate } from 'react-router-dom'
import { useNotificationContext } from "@/context/NotificationContext";

const ResetPassword = () => {

    const navigate = useNavigate();
    const urlParams = new URLSearchParams(window.location.search);
    const secret = urlParams.get('secret');
    const userId = urlParams.get('userId');
    const { setNotification } = useNotificationContext()

    const submit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const password = data.get('password');
        const confirmPassword = data.get('confirmPassword');
        if (password !== confirmPassword) {
            setNotification({
                message: 'Passwords do not match',
                type: 'error'
            })
            return
        }
        try {
            const reset = await authService.resetPassword(userId, secret, password, confirmPassword);
            console.log(reset)
            navigate('/login');
            setNotification({
                message: 'Password Changed',
                type: 'success'
            })

        } catch (error) {
            navigate('/login');
            setNotification({
                message: error?.message || "something went wrong.",
                type: 'error'
            })
        }

    }

    return (
        <div
            id="reset_Password"
            className="flex items-center justify-center w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
            <div
                className={`flex items-center justify-center flex-col mx-auto w-full max-w-lg p-8`}
            >
                <div className="flex justify-center items-center">
                    <img className="Login_signup_Logo" src="Thoughtify.webp" alt="Logo" />
                </div>
                <div className="ResetPassword_ResetPassword flex flex-col w-full">
                    <h2 className={`font-bold text-2xl mt-3 mb-1 text-center`}>
                        Reset Your Password
                    </h2>

                    <form
                        className="max-w-full flex flex-col justify-center items-center"
                        onSubmit={submit}>
                        <div id="Login" className="w-full flex flex-col justify-center items-center mb-3 gap-8">
                            <div className="relative flex flex-col">
                                <input
                                    required
                                    name="password"
                                    type="password"
                                    placeholder=""
                                    className="w-80 rounded px-2 p-1 text-lg bg-gray-300 border-none"
                                />
                                <span>New Password</span>
                                <i className="w-full"></i>
                            </div>
                            <div className="relative flex flex-col">
                                <input
                                    required
                                    name="confirmPassword"
                                    type="password"
                                    placeholder=""
                                    className="w-80 rounded px-2 p-1 text-lg bg-gray-300 border-none"
                                />
                                <span>Repeat Password</span>
                                <i className="w-full"></i>
                            </div>
                        </div>


                        <Button
                            type="submit"
                            className="mt-3 rounded-sm block px-2 py-1 login_signIn_Btn">
                            Change Password
                        </Button>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
