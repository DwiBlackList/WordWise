import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import LevelCRUD from "../js/Pages/LevelCRUD";

const ssrData = document.getElementById("app")?.getAttribute("ssrData");
const initialData = ssrData ? JSON.parse(ssrData) : {};

if (document.getElementById("app")) {
    ReactDOM.createRoot(document.getElementById("app")).render(
        <React.StrictMode>
            <BrowserRouter>
                <LevelCRUD ssrData={initialData} />
            </BrowserRouter>
        </React.StrictMode>
    );
}
