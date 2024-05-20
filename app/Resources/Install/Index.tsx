import React from "react";
import ReactDOM from "react-dom/client";
import App from "./Components/App";
import "boxicons/css/boxicons.css";

ReactDOM.hydrateRoot(
    document.getElementById("application") as HTMLElement,
    <React.StrictMode>
    	<App />
    </React.StrictMode>,
);
