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
      <div className="flex flex-col md:flex-row mx-2">
        {children}
        <Outlet />
      </div>
    </>
  );
}
