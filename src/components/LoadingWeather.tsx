import { RiLoaderFill } from "react-icons/ri";

// Shows a loading indicator while the dashboard waits for its first weather response.
export const LoadingWeather = () => {
  return (
    <div className="loading">
      <RiLoaderFill className="loading-icon" />
      <p>Locating Weather...</p>
    </div>
  );
};
