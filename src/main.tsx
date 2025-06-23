import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import { GamificationProvider } from "./contexts/GamificationContext";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <GamificationProvider>
          <App />
          <Toaster position="top-right" />
        </GamificationProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
