// react router
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// pages
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import RequestResetPage from "./pages/RequestResetPage.tsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.tsx";
// components
import MainLayout from "./components/layout/MainLayout.tsx";
import ProfilePanel from "./components/profile-panel/ProfilePanel.tsx";
import SettingsPanel from "./components/settings-panel/SettingsPanel.tsx";
import Dashboard from "./components/dashboard-panel/Dashboard.tsx";
import AssetsPanel from "./components/assets-panel/AssetsPanel.tsx";
import ExplorePanel from "./components/explore-panel/ExplorePanel.tsx";
import SwapPanel from "./components/swap-panel/SwapPanel.tsx";
import SendPanel from "./components/send-panel/SendPanel.tsx";
import CoinPanel from "./components/coin-panel/CoinPanel.tsx";
// context
import { UserProvider } from "./context/UserContext";
import { DataProvider } from "./context/DataContext";
import { ThemeProvider } from "./context/ThemeContext.tsx";
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
    element: <RequestResetPage />,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
  },
  {
    path: "/app",
    element: (
      <ProtectedRoutes>
        <MainLayout />
      </ProtectedRoutes>
    ),
    children: [
      { path: "profile", element: <ProfilePanel /> },
      { path: "settings", element: <SettingsPanel /> },
      { path: "home", element: <Dashboard /> },
      { path: "assets", element: <AssetsPanel /> },
      { path: "explore", element: <ExplorePanel /> },
      { path: "swap", element: <SwapPanel /> },
      { path: "send", element: <SendPanel /> },
      { path: "coin/:coinName", element: <CoinPanel /> },
    ],
  },
]);

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="cryptodashe-ui-theme">
      <DataProvider>
        <UserProvider>
          <RouterProvider router={router} />
        </UserProvider>
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;
