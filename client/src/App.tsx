// react router
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoutes from "./lib/ProtectedRoutes.tsx";
// layouts
import AppLayout from "./components/layout/AppLayout.tsx";
import ExternalLayout from "./components/layout/ExternalLayout.tsx";
// pages
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import RequestResetPage from "./pages/RequestResetPage.tsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.tsx";
import ToSPage from "./pages/ToSPage.tsx";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage.tsx";
import DisclaimerPage from "./pages/DisclaimerPage.tsx";
import FAQPage from "./pages/FAQPage.tsx";
// components
import ProfilePanel from "./components/panels/profile-panel/ProfilePanel.tsx";
import SettingsPanel from "./components/panels/settings-panel/SettingsPanel.tsx";
import DashboardPanel from "./components/panels/dashboard-panel/DashboardPanel.tsx";
import AssetsPanel from "./components/panels/assets-panel/AssetsPanel.tsx";
import ExplorePanel from "./components/panels/explore-panel/ExplorePanel.tsx";
import InsightsPanel from "./components/panels/insights-panel/InsightsPanel.tsx";
import SwapPanel from "./components/panels/swap-panel/SwapPanel.tsx";
import SendPanel from "./components/panels/send-panel/SendPanel.tsx";
import CoinPanel from "./components/panels/coin-panel/CoinPanel.tsx";
// context
import { UserProvider } from "./context/UserContext";
import { DataProvider } from "./context/DataContext";
import { ThemeProvider } from "./context/ThemeContext.tsx";
// css
import "./globals.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ExternalLayout>
        <LoginPage />
      </ExternalLayout>
    ),
  },
  {
    path: "/login",
    element: (
      <ExternalLayout>
        <LoginPage />
      </ExternalLayout>
    ),
  },
  {
    path: "/register",
    element: (
      <ExternalLayout>
        <RegisterPage />
      </ExternalLayout>
    ),
  },
  {
    path: "/reset",
    element: (
      <ExternalLayout>
        <RequestResetPage />
      </ExternalLayout>
    ),
  },
  {
    path: "/reset-password",
    element: (
      <ExternalLayout>
        <ResetPasswordPage />
      </ExternalLayout>
    ),
  },
  {
    path: "/terms-of-service",
    element: (
      <ExternalLayout>
        <ToSPage />
      </ExternalLayout>
    ),
  },
  {
    path: "/privacy-policy",
    element: (
      <ExternalLayout>
        <PrivacyPolicyPage />
      </ExternalLayout>
    ),
  },
  {
    path: "/disclaimer",
    element: (
      <ExternalLayout>
        <DisclaimerPage />
      </ExternalLayout>
    ),
  },
  {
    path: "/faq",
    element: (
      <ExternalLayout>
        <FAQPage />
      </ExternalLayout>
    ),
  },
  {
    path: "/app",
    element: (
      <ProtectedRoutes>
        <AppLayout />
      </ProtectedRoutes>
    ),
    children: [
      { path: "profile", element: <ProfilePanel /> },
      { path: "settings", element: <SettingsPanel /> },
      { path: "home", element: <DashboardPanel /> },
      { path: "assets", element: <AssetsPanel /> },
      { path: "explore", element: <ExplorePanel /> },
      { path: "insights", element: <InsightsPanel /> },
      { path: "swap", element: <SwapPanel /> },
      { path: "send", element: <SendPanel /> },
      { path: "coin/:coinName", element: <CoinPanel /> },
    ],
  },
]);

function App() {
  return (
    <div className="flex flex-col min-h-screen mx-auto max-w-screen-xl">
      <ThemeProvider defaultTheme="dark" storageKey="cryptodashe-ui-theme">
        <DataProvider>
          <UserProvider>
            <RouterProvider router={router} />
          </UserProvider>
        </DataProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
