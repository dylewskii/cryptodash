import { Outlet } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import MainContent from "../main-content/MainContent";
import { Toaster } from "../ui/toaster";

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <Toaster />
      <div className="flex flex-col md:flex-row mx-2">
        <Sidebar />
        <MainContent>
          <Outlet />
        </MainContent>
      </div>
    </>
  );
}
