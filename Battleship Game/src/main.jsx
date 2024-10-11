import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App.jsx";
import "./Index.css";

ReactDom.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router basename="/BattleshipPP3">
      <App />
    </Router>
  </React.StrictMode>
);
