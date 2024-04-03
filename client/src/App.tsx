import "./App.css";
import Dashboard from "./components/Dashboard.tsx";
import MainContent from "./components/MainContent.tsx";
import Sidebar from "./components/Sidebar.tsx";

function App() {
  return (
    <div className="flex flex-row min-h-screen">
      <Sidebar />
      <MainContent>
        <Dashboard />
      </MainContent>
    </div>
  );
}

export default App;
