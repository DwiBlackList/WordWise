import React from "react";
import ReactDOM from "react-dom/client";
import { LandingPage } from "./Pages/LandingPage";
import { BrowserRouter } from "react-router-dom";

if (document.getElementById("app")) {
    ReactDOM.createRoot(document.getElementById("app")).render(
        <React.StrictMode>
            <BrowserRouter>
                <LandingPage />
            </BrowserRouter>
        </React.StrictMode>
    );
}
