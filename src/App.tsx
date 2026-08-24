import { Toaster } from "react-hot-toast";
import { DisplayWeather } from "./components/DisplayWeather";
import "./index.css";

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <DisplayWeather />
    </>
  );
}

export default App;
