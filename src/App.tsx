import { Toaster } from "react-hot-toast";
import { DisplayWeather } from "./components/DisplayWeather";
import "./index.css";

// Mounts the dashboard and the shared toast area for app-wide notifications.
function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <DisplayWeather />
    </>
  );
}

export default App;
