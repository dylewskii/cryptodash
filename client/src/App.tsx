// react router
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// pages
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import ResetPage from "./pages/ResetPage.tsx";
// components
import MainLayout from "./components/layout/MainLayout.tsx";
import Dashboard from "./components/dashboard-panel/Dashboard.tsx";
import AssetsPanel from "./components/assets-panel/AssetsPanel.tsx";
import ExplorePanel from "./components/explore-panel/ExplorePanel.tsx";
import SwapPanel from "./components/swap-panel/SwapPanel.tsx";
import SendPanel from "./components/send-panel/SendPanel.tsx";
// context
import { UserProvider } from "./context/UserContext";
import { DataProvider } from "./context/DataContext";
// css
import "./globals.css";
import ProtectedRoutes from "./lib/ProtectedRoutes.tsx";

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
    path: "/reset",
    element: <ResetPage />,
  },
  {
    path: "/app",
    element: (
      <ProtectedRoutes>
        <MainLayout />
      </ProtectedRoutes>
    ),
    children: [
      { path: "home", element: <Dashboard /> },
      { path: "assets", element: <AssetsPanel /> },
      { path: "explore", element: <ExplorePanel /> },
      { path: "swap", element: <SwapPanel /> },
      { path: "send", element: <SendPanel /> },
    ],
  },
]);

function App() {
  return (
    <DataProvider>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </DataProvider>
  );
}

export default App;
