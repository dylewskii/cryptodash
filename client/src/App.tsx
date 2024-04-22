import "./App.css";
import { Outlet } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { DataProvider } from "./context/DataContext";

function App() {
  return (
    <DataProvider>
      <UserProvider>
        <Outlet />
      </UserProvider>
    </DataProvider>
  );
}

export default App;
