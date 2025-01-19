import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import Table from "../js/Pages/Table";

const ssrData = document.getElementById("app")?.getAttribute("data-ssr");
const initialData = ssrData ? JSON.parse(ssrData) : {};

if (document.getElementById("app")) {
    ReactDOM.createRoot(document.getElementById("app")).render(
        <React.StrictMode>
            <BrowserRouter>
                <Table initialData={initialData} />
            </BrowserRouter>
        </React.StrictMode>
    );
}
