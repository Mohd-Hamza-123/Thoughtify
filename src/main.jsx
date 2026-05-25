import "./index.css";
import React from "react";
import App from "./App.jsx";
import store from "./store/store.js";
import { Provider } from "react-redux";
import ReactDOM from "react-dom/client";
import { Toaster } from "@/components/ui/sonner"
import { BrowserRouter } from "react-router-dom";
import QueryProvider from "./Providers/QueryProvider.jsx";
import BooleanProvider from "./Providers/BooleanProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryProvider>
      <BrowserRouter>
        <Provider store={store}>
          <BooleanProvider>
            <Toaster />
            <App />
          </BooleanProvider>
        </Provider>
      </BrowserRouter>
    </QueryProvider>
  </React.StrictMode>
);
