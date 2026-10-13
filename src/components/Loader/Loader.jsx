import React from 'react'
import { siteName } from "@/constant"

const Loader = () => {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen text-center bg-gradient-to-br from-slate-50 via-white to-blue-50 fixed top-0 left-0 w-screen z-50"
      aria-busy="true"
      role="status"
      aria-label="Loading"
    >
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-40 h-40 bg-bluePrimary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-bluePrimary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 right-20 w-40 h-40 bg-bluePrimary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 px-4 sm:px-6 md:px-8 max-w-md sm:max-w-lg">
        {/* Logo/Site Name */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 text-gray-900 tracking-tight">
          Welcome to{' '}
          <span className="text-bluePrimary">
            {siteName}
          </span>
        </h1>

        {/* Loading Message */}
        <p className="text-sm sm:text-base lg:text-lg text-gray-500 mb-8 sm:mb-12 font-medium">
          Please wait while we are loading your data...
        </p>

        {/* Animated Spinner */}
        <div className="flex justify-center mb-8 sm:mb-10">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20">
            {/* Outer Ring */}
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-bluePrimary border-r-bluePrimary animate-spin"></div>

            {/* Middle Ring */}
            <div className="absolute inset-2 rounded-full border-3 border-transparent border-b-bluePrimary animate-spin animation-delay-1000" style={{ animationDirection: 'reverse' }}></div>

            {/* Inner Dot */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 bg-bluePrimary rounded-full"></div>
          </div>
        </div>

        {/* Loading Dots Animation */}
        <div className="flex gap-2 justify-center">
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-bluePrimary rounded-full animate-bounce"></span>
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-bluePrimary rounded-full animate-bounce animation-delay-100"></span>
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-bluePrimary rounded-full animate-bounce animation-delay-200"></span>
        </div>
      </div>
    </div>
  )
}

export default Loader