import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";

import "./styles/index.css";

import theme from "./theme";
import App from "pages/App";
import { LocaleProvider } from "context/LocaleProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LocaleProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </LocaleProvider>
  </React.StrictMode>
);
