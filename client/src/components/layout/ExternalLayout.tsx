import { Outlet } from "react-router-dom";
import { Toaster } from "../ui/toaster";
import ScrollToTop from "../misc/ScrollToTop";
import Header from "../header/Header";
import Footer from "../footer/Footer";

interface ExternalLayoutProps {
  children?: React.ReactNode;
}

export default function ExternalLayout({ children }: ExternalLayoutProps) {
  return (
    <>
      <ScrollToTop />
      <Toaster />
      <Header />
      <div className="flex-grow flex flex-col justify-center items-center py-8">
        {children}
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
