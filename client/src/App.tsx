// react router
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ProtectedRoutes } from "./components/misc/ProtectedRoutes.tsx";
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
import ProfilePanel from "./components/panels/profile/ProfilePanel.tsx";
import SettingsPanel from "./components/panels/settings/SettingsPanel.tsx";
import DashboardPanel from "./components/panels/dashboard/DashboardPanel.tsx";
import AssetsPanel from "./components/panels/assets/AssetsPanel.tsx";
import ExplorePanel from "./components/panels/explore/ExplorePanel.tsx";
import InsightsPanel from "./components/panels/insights/InsightsPanel.tsx";
import CoinPanel from "./components/panels/coin/CoinPanel.tsx";
// context
import { ThemeProvider } from "./context/ThemeContext.tsx";
// hooks
import { useInitialization } from "./hooks/useInitialization.ts";
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
      { path: "coin/:coinId", element: <CoinPanel /> },
    ],
  },
]);

function App() {
  useInitialization();

  return (
    <div className="flex flex-col min-h-screen mx-auto max-w-screen-xl">
      <ThemeProvider defaultTheme="dark" storageKey="cryptodashe-ui-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
    </div>
  );
}

export default App;
