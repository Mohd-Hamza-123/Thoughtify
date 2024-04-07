// import React, { useState } from 'react'
// import './LoginWithPhone.css'
// import QueryFlow from '../assets/QueryFlow.png'
// import { useForm } from "react-hook-form";
// import { Button } from '../components';
// import { Link } from 'react-router-dom';
// import authService from '../appwrite/auth';

// const LoginWithPhone = () => {
//     const { register, handleSubmit } = useForm();
//     const [isPhoneNumberVisible, setisPhoneNumberVisible] = useState(true)
//     const [userId, setuserId] = useState('')
//     const LoginWithPhone = async (data) => {
//         console.log(data)
//         data.number = `+91${data.number}`
//         if (isPhoneNumberVisible) {
//             setisPhoneNumberVisible(false)
//             const number = Number(data.number)
//             // console.log(number)
//             const getNumber = await authService.logInWithNumber(data.number)
//             console.log(getNumber)
//             setuserId(getNumber.userId);
//         } else {
//             const verifyOTP = await authService.logInWithNumberEnterSecret(userId, data.secret);
//             console.log(verifyOTP)
//         }
//     }

//     return (
//         <>
//             <div id="LoginWithPhone_Container" className="flex items-center justify-center w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
//                 <div
//                     className={`flex items-center justify-center flex-col mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-8 border border-black/10`}
//                 >
//                     <div className="flex justify-center items-center">
//                         <img className="LoginWithPhone_Logo" src={QueryFlow} alt="" />
//                     </div>
//                     <div className="flex flex-col w-full">
//                         <h1 className="font-bold text-2xl mt-3 text-center text-black">
//                             Login With Number
//                         </h1>
//                         <div className="mx-auto mt-2">
//                             <p>
//                                 Don't have a Number ?&nbsp;
//                                 <Link
//                                     className="font-medium text-primary transition-all duration-200 hover:underline"
//                                     to={"/signup"}
//                                 >
//                                     signIn with Email
//                                 </Link>
//                             </p>
//                         </div>

//                         {/* {error && <p className="text-red-600 mt-2 text-center">{error}</p>} */}

//                         <form
//                             className="max-w-full flex flex-col justify-center items-center"
//                             onSubmit={handleSubmit(LoginWithPhone)}
//                         >
//                             <div id='Login' className="w-full flex flex-col justify-center items-center mb-3 gap-8">
//                                 {isPhoneNumberVisible && <div className="relative flex flex-col">
//                                     <input
//                                         required
//                                         type="number"
//                                         placeholder=""
//                                         className="w-80 rounded px-2 p-1 text-lg bg-gray-300 border-none"
//                                         {...register("number", {
//                                             required: false,
//                                         })}
//                                     />
//                                     <span>Number</span>
//                                     <i className="w-full"></i>
//                                 </div>}
//                                 {!isPhoneNumberVisible && <div className="relative flex flex-col">
//                                     <input
//                                         required
//                                         type="text"
//                                         placeholder=""
//                                         className="border-none rounded px-2 p-1 bg-gray-300 text-lg w-80"
//                                         {...register("secret", {
//                                             required: false,
//                                         })}
//                                     />
//                                     <span>OTP</span>
//                                     <i className="w-full"></i>
//                                 </div>}
//                             </div>

//                             <div>
//                                 <Button type="submit" className="mt-3 rounded-sm  block px-2 py-1 bg-slate-800 text-white">
//                                     {`${isPhoneNumberVisible ? 'Generate OTP' : 'Enter OTP'}`}
//                                 </Button>
//                             </div>
//                         </form>


//                     </div>
//                 </div>
//             </div>
//         </>
//     )
// }

// export default LoginWithPhone