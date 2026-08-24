import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";
import Widget from "./components/Widget.jsx";

import "./styles/App.css";

const isWidget =
	window.location.pathname === "/widget";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		{isWidget ? <Widget /> : <App />}
	</StrictMode>
);