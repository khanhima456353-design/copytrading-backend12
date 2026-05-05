import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./i18n";
import reportWebVitals from "./reportWebVitals";

import { BrowserRouter } from "react-router-dom";

// Components
import App from "./App";
import Navbar from "./Navbar";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>

      {/* GLOBAL LAYOUT */}
      <div className="app-layout">

        {/* Optional Navbar */}
        <Navbar />

        {/* App handles routes */}
        <App />

      </div>

    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();