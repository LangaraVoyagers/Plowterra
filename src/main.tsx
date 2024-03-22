import React from "react";
import ReactDOM from "react-dom/client";

import "./styles/index.css";

import App from "pages/App";
import { LocaleProvider } from "context/LocaleProvider";
import { ThemeProvider } from "context/ThemeProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LocaleProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </LocaleProvider>
  </React.StrictMode>
);
