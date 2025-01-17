import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import LevelCRUD from "../js/Pages/LevelCRUD";

const classState = JSON.parse(
    document.getElementById("app")?.getAttribute("class")
);

const levelsState = JSON.parse(
    document.getElementById("app")?.getAttribute("levels")
);

if (document.getElementById("app")) {
    ReactDOM.createRoot(document.getElementById("app")).render(
        <React.StrictMode>
            <BrowserRouter>
                <LevelCRUD classState={classState} levelState={levelsState} />
            </BrowserRouter>
        </React.StrictMode>
    );
}
