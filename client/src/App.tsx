import "./App.css";
import MainContent from "./components/MainContent.tsx";
import Sidebar from "./components/Sidebar.tsx";

function App() {
  return (
    <div className="flex flex-row min-h-screen">
      <Sidebar />
      <MainContent>
        <div>content</div>
      </MainContent>
    </div>
  );
}

export default App;
