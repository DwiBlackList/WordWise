import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import UsersCRUD from "../js/Pages/UsersCRUD";

const usersData = document.getElementById("app")?.getAttribute("users");
const initialData = usersData ? JSON.parse(usersData) : [];
if (document.getElementById("app")) {
    ReactDOM.createRoot(document.getElementById("app")).render(
        <React.StrictMode>
            <BrowserRouter>
                <UsersCRUD initialData={initialData} />
            </BrowserRouter>
        </React.StrictMode>
    );
}
