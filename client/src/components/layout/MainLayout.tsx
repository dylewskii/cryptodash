import { Outlet } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import MainContent from "../main-content/MainContent";

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row">
        <Sidebar />
        <MainContent>
          <Outlet />
        </MainContent>
      </div>
    </>
  );
}
