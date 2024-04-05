import "./App.css";
import Dashboard from "./components/dashboard/Dashboard.tsx";
import MainContent from "./components/main-content/MainContent.tsx";
import Sidebar from "./components/sidebar/Sidebar.tsx";

function App() {
  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar />
      <MainContent>
        <Dashboard />
      </MainContent>
    </div>
  );
}

export default App;
