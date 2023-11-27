import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App/index.jsx";
import { ThemeProvider } from "./components/ui/theme-provider.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
