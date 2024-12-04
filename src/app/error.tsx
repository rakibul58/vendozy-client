"use client";

import { CircleAlert } from "lucide-react";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full text-center p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <CircleAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
        
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          Oops! Something went wrong.
        </h2>
        
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          An unexpected error occurred. Please try again or contact support if the problem persists.
        </p>
        
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
