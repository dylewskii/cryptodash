// react
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// pages
import LoginPage from "./components/login-page/LoginPage.tsx";
import RegisterPage from "./components/register-page/RegisterPage.tsx";
// components
import MainLayout from "./components/layout/MainLayout.tsx";
import Dashboard from "./components/dashboard-panel/Dashboard.tsx";
import AssetsPanel from "./components/assets-panel/AssetsPanel.tsx";
import ExplorePanel from "./components/explore-panel/ExplorePanel.tsx";
import SwapPanel from "./components/swap-panel/SwapPanel.tsx";
import SendPanel from "./components/send-panel/SendPanel.tsx";
// css
import "./globals.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/app",
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
