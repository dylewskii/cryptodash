import { Outlet } from "react-router-dom";
import { Toaster } from "../ui/toaster";
import ScrollToTop from "../misc/ScrollToTop";

interface ExternalLayoutProps {
  children?: React.ReactNode;
}

export default function ExternalLayout({ children }: ExternalLayoutProps) {
  return (
    <>
      <ScrollToTop />
      <Toaster />
      <div className="flex justify-center items-center min-h-screen">
        {children}
        <Outlet />
      </div>
    </>
  );
}
