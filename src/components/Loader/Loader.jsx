import React from 'react'

const Loader = () => {
  return (
    <div 
      className="flex flex-col items-center justify-center h-screen text-center bg-white fixed top-0 w-screen z-10"
      aria-busy="true"
    >
      <h1 className="text-3xl font-bold mb-2">
        Welcome to <span className="text-bluePrimary">Thoughtify</span>
      </h1>
      <p className="text-gray-500 mb-6">
        Please wait while we are loading your data...
      </p>
      
      {/* Loader Spinner */}
      <div className="w-12 h-12 border-4 border-gray-300 border-t-bluePrimary rounded-full animate-spin"></div>
    </div>
  )
}

export default Loader
