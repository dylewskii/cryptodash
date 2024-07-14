import { Outlet } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import { MainContent } from "./MainContent";
import { Toaster } from "../ui/toaster";
import ScrollToTop from "../misc/ScrollToTop";

export default function AppLayout() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Toaster />
      <div className="flex flex-col items-between md:flex-row">
        <Sidebar />
        <MainContent>
          <Outlet />
        </MainContent>
      </div>
    </>
  );
}
