import React from "react";
import ReactDom from "react-dom/client";
import Archive from "../archive";

const root = document.getElementById("root");
if (root)
    ReactDom.createRoot(root).render(
        <React.StrictMode>
            <Archive />
        </React.StrictMode>,
    );
