import { RiLoaderFill } from "react-icons/ri";

export const LoadingWeather = () => {
  return (
    <div className="loading">
      <RiLoaderFill className="loading-icon" />
      <p>Locating Weather...</p>
    </div>
  );
};
