import { Outlet } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import MainContent from "../main-content/MainContent";
import { Toaster } from "../ui/toaster";

export default function AppLayout() {
  return (
    <>
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
