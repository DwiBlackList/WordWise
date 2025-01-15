import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Dashboard } from "../js/Pages/Dashboard";

const ssrData = document.getElementById("app")?.getAttribute("data-ssr");
const initialData = ssrData ? JSON.parse(ssrData) : {};

if (document.getElementById("app")) {
    ReactDOM.createRoot(document.getElementById("app")).render(
        <React.StrictMode>
            <BrowserRouter>
                <Dashboard initialData={initialData} />
            </BrowserRouter>
        </React.StrictMode>
    );
}
