import React from "react";
import ReactDom from "react-dom/client";

import Main from "../main";

const root = document.getElementById("root");
if (root)
	ReactDom.createRoot(root).render(
		<React.StrictMode>
			<Main />
		</React.StrictMode>,
	);
