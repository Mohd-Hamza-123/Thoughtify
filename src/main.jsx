import "./index.css";
import React from "react";
import App from "./App.jsx";
import store from "./store/store.js";
import { Provider } from "react-redux";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import QueryProvider from "./Providers/QueryProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryProvider>
      <BrowserRouter>
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
    </QueryProvider>
  </React.StrictMode>
);
