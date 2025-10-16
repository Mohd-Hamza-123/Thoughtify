import React from 'react'
import { AlertTriangle } from 'lucide-react'

const NotFound = () => {

  const handleGoBack = () => {
    window.history.back()
  }

  const handleGoHome = () => {
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center px-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md space-y-6">
        <div className="flex justify-center">
          <div className="bg-red-100 dark:bg-red-900 p-4 rounded-full">
            <AlertTriangle className="w-10 h-10 text-red-500 dark:text-red-400" />
          </div>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Something went wrong
        </h1>

        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Oops! Something unexpected happened. Please try again later or go back to the home page.
        </p>

        <div className="flex justify-center gap-3 pt-2">
          <button
            onClick={handleGoBack}
            className="px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            Go Back
          </button>
          <button
            onClick={handleGoHome}
            className="px-5 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFound
