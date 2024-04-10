import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout.tsx";
import Dashboard from "./components/dashboard-panel/Dashboard.tsx";
import AssetsPanel from "./components/assets-panel/AssetsPanel.tsx";
import ExplorePanel from "./components/explore-panel/ExplorePanel.tsx";
import SwapPanel from "./components/swap-panel/SwapPanel.tsx";
import SendPanel from "./components/send-panel/SendPanel.tsx";
import "./globals.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "home", element: <Dashboard /> },
      { path: "assets", element: <AssetsPanel /> },
      { path: "explore", element: <ExplorePanel /> },
      { path: "swap", element: <SwapPanel /> },
      { path: "send", element: <SendPanel /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
