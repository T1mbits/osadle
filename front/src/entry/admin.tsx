import React from "react";
import ReactDom from "react-dom/client";

import Admin from "../admin";

const root = document.getElementById("root");
if (root)
    ReactDom.createRoot(root).render(
        <React.StrictMode>
            <Admin />
        </React.StrictMode>,
    );
