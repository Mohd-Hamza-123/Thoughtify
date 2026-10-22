import React from "react";
import * as Sentry from "@sentry/react";

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    Sentry.captureException(error, {
      contexts: { react: { componentStack: errorInfo?.componentStack } },
    });
    if (import.meta.env.DEV) {
      console.error("React Error:", error, errorInfo);
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        role="alert"
        className="min-h-screen flex flex-col items-center justify-center text-center px-4"
      >
        <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          The page crashed. Please refresh or go back home.
        </p>

        {import.meta.env.DEV && this.state.error && (
          <pre className="text-left text-xs text-red-600 max-w-xl overflow-auto mb-4">
            {String(this.state.error?.stack || this.state.error)}
          </pre>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-black text-white rounded-md dark:bg-white dark:text-black"
          >
            Refresh Page
          </button>
          <a href="/" className="px-4 py-2 border rounded-md">
            Go Home
          </a>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;