import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Toaster } from "@/components/ui/sonner";
import { SocketContextProvider } from "./Hooks/SocketContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <SocketContextProvider>
    <App />
    <Toaster closeButton />
  </SocketContextProvider>
);
