import { Outlet } from "react-router-dom";
import { Toaster } from "../ui/toaster";
import ScrollToTop from "../misc/ScrollToTop";
import Header from "../header/Header";

interface ExternalLayoutProps {
  children?: React.ReactNode;
}

export default function ExternalLayout({ children }: ExternalLayoutProps) {
  return (
    <>
      <ScrollToTop />
      <Toaster />
      <Header />
      <div className="flex flex-col justify-center items-center min-h-screen">
        {children}
        <Outlet />
      </div>
    </>
  );
}
