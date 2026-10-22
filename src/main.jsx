import "./lib/sentry"
import "./index.css";
import React from "react";
import App from "./App.jsx";
import store from "./store/store.js";
import { Provider } from "react-redux";
import ReactDOM from "react-dom/client";
import { Toaster } from "@/components/ui/sonner"
import { BrowserRouter } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import QueryProvider from "./Providers/QueryProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryProvider>
        <BrowserRouter>
          <Provider store={store}>
            <Toaster />
            <App />
          </Provider>
        </BrowserRouter>
      </QueryProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
