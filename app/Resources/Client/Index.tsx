import React from "react";
import ReactDOM from "react-dom/client";

ReactDOM.hydrateRoot(
    document.getElementById("application") as HTMLElement,
    <React.StrictMode>
    	<div>OLÁ</div>
    </React.StrictMode>,
);
