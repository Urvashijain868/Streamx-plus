import { StrictMode } from "react";

import { createRoot } from "react-dom/client";

import "./index.css";

import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";

const user =
  JSON.parse(localStorage.getItem("user"));

if (
  !user &&
  window.location.pathname !== "/login"
) {

  window.location.href = "/login";
}

createRoot(document.getElementById("root")).render(

  <StrictMode>

    <BrowserRouter>

      <App />

    </BrowserRouter>

  </StrictMode>
);