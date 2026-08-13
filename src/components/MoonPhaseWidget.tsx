import { BsMoon } from "react-icons/bs";
import { WeatherWidget } from "./WeatherWidget";
import fullMoon from "../assets/full-moon.webp";

export const MoonPhaseWidget = () => {
  return (
    <WeatherWidget
      title="NEW MOON"
      icon={<BsMoon />}
      className="span-two moon-widget"
    >
      <div className="moon-content">
        <div className="moon-stats">
          <div className="moon-stat-row">
            <span className="stat-label">Illumination</span>
            <span className="stat-value">0%</span>
          </div>

          <div className="moon-stat-row">
            <span className="stat-label">Next Moonrise</span>
            <span className="stat-value"> 17:02</span>
          </div>

          <div className="moon-stat-row">
            <span className="stat-label">Next Full Moon</span>
            <span className="stat-value"> 16 DAYS</span>
          </div>
        </div>

        <div className="moon-image-container">
          <div className="moon-placeholder"></div>
        </div>
      </div>
    </WeatherWidget>
  );
};
